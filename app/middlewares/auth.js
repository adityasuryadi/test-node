// const jwt = require("jsonwebtoken");
// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         jwt.verify(token, accessTokenSecret, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }

//             req.user = user;
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// };

// module.exports = authenticateJWT;

const jwt = require('jsonwebtoken');

module.exports = {
  isAuth: (req,res,next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
    //   const token = req.headers.token;
      var decoded = jwt.verify(token, process.env.secret);
      req.user = decoded;
      next();
    } catch(err) {
      res.status(401).json({
        message: 'Token is Invalid'
      });
    }
  },
  isAuthorized: (req,res,next) => {
    if (req.user.role == 'admin') {
      next();
    } else {
      res.status(401).json({
        message: 'User Not Authorized'
      });
    }
  }
};