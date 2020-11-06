const express = require('express')
const controllers = require('./controllers')
const tokenMiddleware = require('./security/token')
const inputValidator = require('./security/inputValidator')
const sessionManagement = require('./security/sessions')
var dotenv = require('dotenv');
// const authorizationMiddleware = require('./security/authorize')

const router = express.Router()

// Unporotected routes
router.use('/unprotected', controllers.unprotectedAction)//example of an unprotected route
router.post('/signup', inputValidator.validateUserSignUp, controllers.signUp)//validate user-supplied info before writing to db
router.post('/signin', inputValidator.validateUserSignIn, controllers.signIn)//validate user-supplied info before querying db

// Protected routes
router.use(sessionManagement.getSession)//every resource must be logged in before they can access these routes
router.post('/signout', sessionManagement.destroySession, controllers.signOut)//session is destroyed and is verified to complete signout
router.get('/userdetails/:user', inputValidator.validateUserdetails, tokenMiddleware.validateToken, controllers.retrieveUserdetails)//validate info before querying db, validate presence of token before getting details


module.exports = router
