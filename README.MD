# Image Uploader

Let's see if i've learnt enough to make one :)

## Technologies

Backend: Node.js / Express
FrontEnd: Next.js / tailwindcss
Database: Firestore
Authentication: Firebase

## Structure of the project

- Server
|- responsible for the api
- Dashboard
|- responsible for the frontend

## TODO (MVP)

- [X] Create a POST route /api/upload that accepts a file and returns the image url
- [X] Make sure a file can't have the same name as an existing file
- [X] Create a GET route /server/uploads/:filename that returns a html file with the image
- [X] Create a GET route /raw/:filename that returns the actual image
- [X] Create a POST route /api/delete that accepts a url and deletes the image
- [X] Create a GET route /api/images that returns a json response with all the images

## TODO (DASHBOARD)

- [ ] Create a dashboard that shows all the images
- [ ] Lists all images with a delete button, copy url button and a raw url button
- [ ] Upload form

## TODO (ADMIN)

- [ ] Create a POST route /admin/createApi that takes a admin key, username, email and creates a api key for the user and saves it to a database (firestore)
- [ ] Create a GET route /admin/listKeys that lists every api key, who owns it and when it was created.
- [ ] Create a POST route /admin/deleteKey that takes a api key and deletes it from the database (firestore)
- [ ] Create