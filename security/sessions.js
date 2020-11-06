var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var dotenv = require('dotenv');

//check for session object
module.exports.getSession = (req, res, next) => {
  if(req.session){
    next();
  } else{
    return res.status(401).send({ message: 'Unable to access resource'})
  }
}

//destroy session in sessionstore
module.exports.destroySession = (req, res, next) => {
  if(req.session){
    req.session.destroy(function (err){
        next()
    });
  }
  else {
    return res.status(401).send({ message: 'User not signed in'})
  }
}
