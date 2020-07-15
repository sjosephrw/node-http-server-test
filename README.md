# PURE NODE JS REST API (WITHOUT EXPRESS JS) 


## Features!

- A REST API written in pure Node JS without the Express JS framework.
- Very few libraries were used in this project.
- The code is Pure JavaScript.
- Only user Sign In / Sign Up and Image upload functionality has been Implemented


### Required Environment Variables
>Create a config.env file in the project root folder and add these Environment variables
- PORT
- DB_PASSWORD
- DATABASE
- JWT_SECRET
- JWT_EXPIRY_TIME
- PASSWORD_SALT



### Tech

The App uses a number of open source projects to work properly:

* javascript - The code is 100% JavaScript
* node.js - For the backend
* nosql - DataBase 



And of course This App itself is open source with a [public repository]
 on GitHub.

### Installation

This App requires [Node.js] v10+ to run.

Install the dependencies and start the server.

```sh
$ cd node-http-server-test
$ npm install
$ npm start
```

Verify the deployment by navigating to your server address in your preferred browser.

```sh
http://127.0.0.1:3000
```

### API End Points

 - Sign Up
```sh
curl -d '{"email":"test@example.com", "password":"password"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/api/v1/auth/signup
```

 - Sign In
```sh
curl -d '{"email":"test@example.com", "password":"password"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/api/v1/auth/signin
```

 - Image Upload
```sh
POST http://127.0.0.1:3000/api/v1/user/profile-img
```

 - Get One User
```sh
curl -X GET 'http://127.0.0.1:3000/api/v1/user?id=<userId>'
```


### Todos

 - Write MORE Code

License
----

MIT

## Drawbacks
* The code is not that reusable.

## Youtube Tutorial
[YOUTUBE](https://www.youtube.com/channel/UCHBEQxtc4La3kNW6nNJpubg)

