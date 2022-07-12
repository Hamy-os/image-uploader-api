const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const morgan = require('morgan');
const _ = require('lodash');
const port = 80;
const fs = require('fs');
const baseurl = `https://firebasestorage.googleapis.com/v0/b/imageuploader-1be3a.appspot.com/o/images%2F`;
const query = "?alt=media&token=dd693d8a-65cc-4ba9-874e-964cdcceb663"
const { getStorage, ref, uploadString  } = require("firebase/storage")
const { initializeApp } = require("firebase/app")
const fires = require('firebase-admin');
const serviceAccount = require('./servicekey.json');
function base64_encode(file) {
    var contents = fs.readFileSync(file).toString('base64');
    return contents;
}
const firebaseConfig = {
    apiKey: process.env.apikey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};


fires.initializeApp({credential: fires.credential.cert(serviceAccount)});

const db = fires.firestore();
const usersDb = db.collection('users');

async function createUser(apikey, email, username, adminKey) {
    usersDb.doc().set({
        apikey: apikey,
        email: email,
        username: username,
        dateAdded: Date.now(),
        admin: adminKey
    });
}

async function uploadImage(filename, ) {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(); // Create a root reference  
    const storageRef = ref(storage, `images/${filename}`);
    const base64str = base64_encode(`./uploads/${filename}`);
    uploadString(storageRef, base64str, 'base64').then((snapshot) => {
        console.log('Uploaded the image!');
    });
}
// enable files upload
app.use(fileUpload({createParentPath: true}));

// add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.listen(port, () => console.log(`App is listening on port ${port}. http://localhost:${port}`));

app.post('/upload', async (req, res) => {
    try {
        if (!req.files) {
            res.status(400).send('No files were uploaded.'); // send a 400 error with a message if no file is uploaded
        } else {
            const buffer = req.files.file.data; // save the buffer as an image
            const image = Buffer.from(buffer, 'base64'); // convert the buffer to an image
            const filename = _.random(100000000, 999999999).toString(); // create a random 8 digit filename
            const extension = req.files.file.name.split('.').pop(); // add the extension to the filename
            const name = filename + '.' + extension // combine the two
            fs.open('./uploads/' + name, 'r', (err, fd) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        fs.writeFileSync(`./uploads/${name}`, image); // create the file
                        uploadImage(name)
                        res.status(200).send(baseurl + name + query); // send response with the url and the status code
                        return;
                    }
                    throw err;
                }
                try {
                    const filename2 = _.random(100000000, 999999999).toString(); // create a random 8 digit filename
                    const name2 = filename2 + '.' + extension // combine the two
                    fs.writeFileSync(`./uploads/${name2}`, image); // create the file
                    uploadImage(name2)// upload the file to firestore
                    res.status(200).send(baseurl + name + query); // send response with the url and the status code
                } finally {
                    fs.close(fd, (err) => {
                        if (err) 
                            throw err;
                        

                    });
                }
            });
        }
    } catch (err) {
        res.status(500).send(err); // send the error back with the status code
    }
});

// make a get route to /uploads/:name that serves the image with the corresponding name
app.get('/uploads/:name', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/raw/:name', (req, res) => {
    const name = req.params.name;
    res.sendFile(__dirname + `/uploads/${name}`);
});

app.get('/list', (req, res) => { // return a json of every file in the uploads directory, their name, their size and their url
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            res.status(500).send(err);
        } else {
            const images = files.map(file => {
                return {
                    name: file,
                    size: fs.statSync(`./uploads/${file}`).size,
                    url: baseurl + file
                }
            }).sort((a, b) => {
                return a.name > b.name;
            }).reverse();
            res.json(images);
        }
    })
});

// make a post route that deletes the image with the corresponding name
app.post('/delete', (req, res) => {
    const name = req.body.name;
    fs.unlink('./uploads/' + name, (err) => {
        if (err) {
            res.status(400).send('No such file, make sure you included the extension. ex: 400718604.png');
        } else {
            res.status(200).send('File deleted');
        }
    });
});

// Create a POST route /admin/createApikey that takes a admin key, username, email and creates a api key for the user and saves it to a database (firestore)
app.post('/admin/createApikey', (req, res) => {
    const adminKey = req.body.adminKey;
    const username = req.body.username;
    const email = req.body.email;
    const str1 = _.random(1000000000000000000, 9999999999999999999).toString();
    const str2 = _.shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789').slice(0, 10).join('');
    const apiKey = str1 + str2;
    if (adminKey === 'admin') {
        if (! username || ! email) {
            res.status(400).send('No username or email provided');
        }
        if (username === '' || email === '') {
            res.status(400).send('Invalid username or email');
        } else {
            res.status(200).send(apiKey);
            // append the api key to a file called apikeys
            fs.appendFileSync('./apikeys.txt', `${apiKey} ${username} ${email}\n`);
            // add the api key to a firebase database
            createUser(apiKey, email, username, adminKey);
        }
    } else {
        res.status(400).send('Invalid admin key');
    }
})

// Create a GET route /admin/listKeys that lists every api key, who owns it and when it was created.
app.get('/admin/listKeys', (req, res) => {
    usersDb.get().then(snapshot => {
        const users = snapshot.docs.map(doc => {
            return {id: doc.id, data: doc.data()}
        }).sort((a, b) => {
            return a.data.dateAdded > b.data.dateAdded;
        }).reverse();
        res.json(users);
    }).catch(err => {
        res.status(500).send(err);
    });
})

// Create a POST route /admin/deleteKey that takes a api key and deletes it from the database (firestore)
app.post('/admin/deleteKey', (req, res) => {
    const adminKey = req.body.adminKey;
    const apiKey = req.body.apiKey;
    if (adminKey === 'admin') {
        if (! apiKey || apiKey === '') {
            res.status(400).send('No api key provided');
        } else {
            usersDb.doc(apiKey).delete().then(() => {
                res.status(200).send('Key deleted');
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    } else {
        res.status(400).send('Invalid admin key');
    }
});
