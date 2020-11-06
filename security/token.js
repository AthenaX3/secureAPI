var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');

dotenv.config()
const jwtSecret = process.env.JWT_SECRET;

//validate presence of token in req.body
module.exports.validateToken = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, jwtSecret, function (err, decoded) {
        if (err) {
          return res.status(401).send({
            message: 'Could not authenticate token', error: err });
        }
        req.decoded = decoded;
        console.log(decoded)
        next();
      });
    } else {
      return res.status(401).send({
        message: "No token provided. Provide token in the request body, or header, or in a query, with key 'x-access-token'", success: false });
    }
}
