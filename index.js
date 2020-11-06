const express = require("express");
const app = express();
const db = require("./sqlite.js");
const bcrypt = require("bcrypt");
const bodyparser = require("body-parser");
const router = require("./routes")
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var dotenv = require('dotenv');

//setting required .env variables
dotenv.config()
const sessions_secret = process.env.SESSION_STORE;
const dbuser = process.env.SESSION_DBUSER;
const dbpass = process.env.SESSION_DBPASS;
const port = process.env.PORT || 3000

//initializing body parser to work on body http req/res body objects
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//initializing session store
var sessionStore = new SQLiteStore({
  db: "sessionsdb",
  table: "Session",
  dir: './security'
});

//creating and initializing session object options
app.use(session({
  store: sessionStore,
  secret: sessions_secret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}));

//base path
app.use("/api", router)


app.use(function(req, res){
  res.status(404);
})

app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});
