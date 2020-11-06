var dotenv = require('dotenv');
const bcrypt = require("bcrypt");
const db = require("./sqlite");
var jwt = require('jsonwebtoken');
var sessions = require('./security/sessions')


dotenv.config()
const jwtSecret = process.env.JWT_SECRET;

//unprotected controller example
module.exports.unprotectedAction = (req, res) => {
  return res.status(200).send({ message: "Unprotected Action Performed Successfully" });
}

//signup controller
module.exports.signUp = (req, res, next) => {
  const { firstname, lastname, username, password, secretanswer } = req.body

  var getuserstmt = db.prepare("SELECT * FROM users WHERE username = ?")
  getuserstmt.get(username, (err, row) =>{
    if(row) {
      return res.status(400).send({ message: 'username already associated with an account' })
    } else{
      console.log(err)
    }
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
    var insertuserstmt = db.prepare('INSERT INTO users (username, fname, lname, password, secret) VALUES (?,?,?,?,?)')
    insertuserstmt.run([username, firstname, lastname, hashPassword, secretanswer], (err) => {
      if(!err) {
        return res.status(201).send({ message: 'Sign up successful'})
      }
      return res.status(400).send({ message: 'sign up failed', err})
    })
  })

  //return res.status(200).send({ message: "SignUp Completed Successfully "})
}

//signin controller checks to see if the username exists and compares supplied password
//with saved password hash saved in db. username and token are attached to the session
module.exports.signIn = (req, res) => {
  const username = req.body.username
  const password = req.body.password

var getuserstmt = db.prepare("SELECT * FROM users WHERE username = ?")
  getuserstmt.get(username, (err, row) =>{
    if(!err){
      if(row) {
        const validPassword = bcrypt.compareSync(password, row.password);
        if (!validPassword) {
          return res.status(401).send({ message: 'sign in failed'})
        }
        const token = jwt.sign({ id: username }, jwtSecret, {
          expiresIn: '2 days' // expires in 48 hours
        });
        // req.session.regenerate(function(err){
        //   if(err){
        //     console.log(err)
        //   }
        // });
        req.session.username = username;
        req.session.token = token;
        // console.log(req.sessionID)

        return res.send({ message: 'success', session: req.session});

      } else {
        return res.send({ message: 'user not found'})
      }

    }
    else {
      console.log(err);
      res.send("user not found", err);
    }
  })

}

//signout controller checks to see if there is an active session, and throw an error
module.exports.signOut = (req, res) => {
  if(!req.session){
    return res.status(200).send({ message: 'Sign out successful'})
  } else {
    return res.status(400).send({ message: 'Sign out failed'})
  }
}

//controller to retrieve user details, checks to see if there's an active session
//and if the session user is the same as the user details being requested
module.exports.retrieveUserdetails = (req, res) => {
  const user = req.params.user
  const username = req.body.username
  const password = req.body.password
  const token = req.body.token
  var tokenUser = ""


  jwt.verify(token, jwtSecret, function (err, decoded){
    if(!err){
      tokenUser = decoded.id;
    }
  });

  if(username != user || tokenUser != username || tokenUser != user){
    res.status(401).send({ message: 'User not permitted to access this resource'})
  } else{
    var getuserstmt = db.prepare("SELECT * FROM users WHERE username = ?")
    getuserstmt.get(username, (err, row) =>{
      if(!err){
        if(row) {
          const validPassword = bcrypt.compareSync(password, row.password);
          if (!validPassword) {
            return res.status(401).send({ message: 'User not permitted to access this resource'})
          }
          console.log("Row... ", row)
          res.status(200).send({message: row})
        }
      } else {
        return res.send({ message: 'User not permitted to access this resource'})
      }
    })
  }

}
