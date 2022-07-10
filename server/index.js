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
            console.log("files ", req.files)
            //TODO: make a function to check if the file name already exists and if it does generate another
            const buffer = req.files.file.data;  // save the buffer as an image
            const image = Buffer.from(buffer, 'base64'); // convert the buffer to an image
            const filename = _.random(100000000, 999999999).toString(); // create a random 8 digit filename
            const extension = req.files.file.name.split('.').pop(); // add the extension to the filename
            const name = filename + '.' + extension // combine the two
            fs.writeFileSync('./uploads/' + name, image); // create the file
            res.status(200).send(baseurl + name); //send response with the url and the status code
        }
    } catch (err) {
        res.status(500).send(err); // send the error back with the status code
    }
});
