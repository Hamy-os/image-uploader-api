# Image Uploader

Let's see if i've learnt enough to make one :)

## Structure of the project

- Server
|- responsible for the api
- Dashboard
|- responsible for the frontend

## TODO ( for now )

- [X] Create a POST route /api/upload that accepts a file and returns the image url
- [X] Make sure a file can't have the same name as an existing file
- [X] Create a GET route /server/uploads/:filename that returns a html file with the image
- [X] Create a GET route /raw/:filename that returns the actual image
- [X] Create a POST route /api/delete that accepts a url and deletes the image
- [X] Create a GET route /api/images that returns a json response with all the images
