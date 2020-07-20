# Wallacloneback

Wallacloneback is the backend application of Wallaclone, wallaclone is an applications that allows the users to buy and sell different products andmore different functionalities like a chat, profile...

## Installation

- Run `npm install` to install all the dependencies

- Change .example.env file name to .env and include the required environment variables

- Run `npm run install-db` to seed database

- Run `npm start` to start the server in production mode or `npm run dev` to run it in development mode



## API documentation

### User Creation
This endpoint is a CRUD of users, allows to create, remove, get one and all users and also edit.

`http://localhost:3000/api/users`

To edit, remove or get one user, specify the user id:

`http://localhost:3000/api/users/9820jidwa92`

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

Endpoint to call to update user password, before recover

`http://localhost:3000/api/recoverpassword/forgotpassword/:userId`

1. password 

### User Logged
Endpoint that return the username of the user logged

`http://localhost:3000/api/currentuser`

Endpoint that return the email of the user logged

`http://localhost:3000/api/currentuser/email?owner=username`

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

### Tags
Return all the tags allowed for the products

`http://localhost:3000/api/tags`

### Favorites
This endpoint allows the user to add adverts to his favourite list and to see them.

`http://localhost:3000/api/favorites`

If you specify the id of the advert you can remove that advert from your favourite list

`http://localhost:3000/api/favorites/6a9d00awd8a62`

### Advert Status
Endpoint to set an advert as sold

`http://localhost:3000/api/status/sold/5f157da203578d17ad3679d7`

Endpoint to set an advert as not sold

`http://localhost:3000/api/status/notsold/5f157da203578d17ad3679d7`

Endpoint to set an advert as reserved

`http://localhost:3000/api/status/reserved/5f157da203578d17ad3679d7`

Endpoint to set an advert as not reserved

`http://localhost:3000/api/status/unreserved/5f157da203578d17ad3679d7`

### Notifications
Endpoint to create a user subscription for the notifications

`http://localhost:3000/notifications/subscribe`