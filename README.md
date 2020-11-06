# secure-api
API implementation to demonstrate secure coding practices. Written in Nodejs/Express.


### Endpoints

  - **/api:** base path. All API endpoints paths start here
  - **POST /api/signup:** An unprotected route. User supplies the following: **FirstName(fname)**, **LastName(lname)**, **Username(username)**, **Password(password)**, **SecretAnswer(secret)** which are stored in the database
  - **POST /api/signin:** Unprotected route. User supplies **username** and **password** which are queried against the db. If successful, a session is created with the username and generated token attached to it and stored in the database
  - **GET /api/userdetails/:user:** Protected route. User supplies the **username** and **password** which is verified against the session token
  - **POST /api/signout:** Protected resource. User session is destroyed and cleared from the session store


### Key Files

  - **Routes.js** describes the flow for each API endpoint
  - **Controllers.js** contains the implementation code for final API actions
  - **Token.js** middleware validates the token in the request body
  - **InputValidator.js** validates user-supplied information that will be written to or used to query the database
  - **Sessions.js** checks for session and destroys session depending on the function call
  - **Index.js** is the base file
  - Database files: **db.sqlite** for user information, **./security/sessionsdb** for session storage


### Architectural considerations

* **Backend database:** **Sqlite3**, because of its simplicity and ease of use. This also influenced my decision to use **connect-sqlite3** as the sesssion store.
* **Input validation**: **Joi**, because of its schema definition, it is easy to enforce (whitelist) required fields, including a max/min length specification.
* **Password hashing:** **bcrypt**, because it is slower to crack than the well-known SHA-family. Another alternative to this I could have used is **scrypt**, which is an improvement over bcrypt
* **Token generation:** **jsonwebtoken**, because it is easy to implement JWT, both for generation and verification
* **Session management:** **express-session**, because it is the most common, default session management framework for express. **Passport.js** would be a viable alternative to help with authentication and session management, but an even better approach would be to use 3rd party applications/integrations such as **Okta**, **OpenID Connect**. These applications are full authentication/authorization/session management suites which simplifies the whole process greatly.
