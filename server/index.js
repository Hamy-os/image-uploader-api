const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const port = 3000;
const fs = require('fs');
const baseurl = "http://localhost:3000/server/uploads/";

// enable files upload
app.use(fileUpload(
    {
        createParentPath: true
    }
));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.listen(port, () => 
    console.log(`App is listening on port ${port}. http://localhost:${port}`)
);

app.post('/api/upload', async (req, res) => {
    try {
        if(!req.files) {
            res.status(400).send('No files were uploaded.'); // send a 400 error with a message if no file is uploaded
        } else {
            const buffer = req.files.file.data;  // save the buffer as an image
            const image = Buffer.from(buffer, 'base64'); // convert the buffer to an image
            const filename = _.random(100000000, 999999999).toString(); // create a random 8 digit filename
            const extension = req.files.file.name.split('.').pop(); // add the extension to the filename
            const name = filename + '.' + extension // combine the two
            fs.open('./uploads/' + name, 'r', (err, fd) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        fs.writeFileSync('./uploads/' + name, image); // create the file
                        res.status(200).send(baseurl + name); //send response with the url and the status code
                        return;
                    }
                    throw err;
                }
                try {
                    const filename2 = _.random(100000000, 999999999).toString(); // create a random 8 digit filename
                    const name2 = filename2 + '.' + extension // combine the two
                    fs.writeFileSync('./uploads/' + name2, image); // create the file
                    res.status(200).send(baseurl + name2); //send response with the url and the status code
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

// make a get route to /server/uploads/:name that serves the image with the corresponding name
app.get('/server/uploads/:name', (req, res) => {
    const name = req.params.name;
    const image = fs.readFileSync('./uploads/' + name);
    res.sendFile(__dirname + '/index.html');
});

app.get('/raw/:name', (req, res) => {
    const name = req.params.name;
    const image = fs.readFileSync('./uploads/' + name);
    res.sendFile(__dirname + `/uploads/${name}`);
});

app.get('/list', (req, res) => {
    // return a json of every file in the uploads directory, their name, their size and their url
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