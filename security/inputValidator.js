const Joi = require('joi')


const userSignUpSchema = Joi.object({
  firstname: Joi.string()
              .max(20)
              .required(),

  lastname: Joi.string()
              .max(20)
              .required(),
  username: Joi.string()
              .alphanum()
              .max(20)
              .required(),
  password: Joi.string()
                .min(8)
                .required(),
  secretanswer: Joi.string()
              .required(),

})

const userSignInSchema = Joi.object({
  username: Joi.string()
              .alphanum()
              .required(),
  password: Joi.string()
              .required(),

})

const userdetailsSchema = Joi.object({
  username: Joi.string()
              .alphanum()
              .required(),
  password: Joi.string()
              .required(),
  token: Joi.string()
            .required()

})

//validate usersignup information
module.exports.validateUserSignUp = async  (req, res, next) => {
  const body = req.body
  try {
      const value = await userSignUpSchema.validateAsync(body);
      next()
  }
  catch (err) {
    if (err) {
      console.log(err)
      return res.status(400).send({ message: 'Sign Up failed'})
    }
  }
}

//validate usersignin information
module.exports.validateUserSignIn = async  (req, res, next) => {
  const body = req.body
  try {
      const value = await userSignInSchema.validateAsync(body);
      next()
  }
  catch (err) {
    if (err) {
      return res.status(400).send({ message: 'Sign In failed'})
    }
  }
}

//validate information used to retrieve user details
module.exports.validateUserdetails = async  (req, res, next) => {
  const body = req.body
  try {
      const value = await userdetailsSchema.validateAsync(body);
      next()
  }
  catch (err) {
    if (err) {
      console.log(err)
      return res.status(400).send({ message: 'Unable to retrieve user details'})
    }
  }
}
