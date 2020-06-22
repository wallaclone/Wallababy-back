# Wallacloneback

Wallacloneback is the backend application of Wallaclone, wallaclone is an applications that allows the users to buy and sell different products andmore different functionalities like a chat, profile...

## Installation

Use the package manager npm to run this application

`npm start`

To run the application in developer mode

`npm run dev`

## API

### User Creation
Endpoint to call to create users in the app.

`http://localhost:3000/api/users`

Required Fields:

1. username
2. email
3. password

### Login
Endpoint to call to login users in the app.

`http://localhost:3000/api/login`

Required Fields:

1. username
2. password

### Recover Password
Endpoint to call to recover the password of a user

`http://localhost:3000/api/recoverpassword`

Required Fields:

1. email

### Advertisements
This endpoint is a CRUD of adverts, allows to create, remove, get one and all adverts and also edit.

`http://localhost:3000/api/adverts`

To edit, remove or get one advert specify the advert id:

`http://localhost:3000/api/adverts/9820jidwa92`

Required Fields:

1. name
2. description
3. image
4. status
5. price
6. tags

