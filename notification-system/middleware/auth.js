const jwt_decode = require('jwt-decode');
const GLOBAL_MESSAGE = require('../configs/globalMessage.json');
const response = require('../utils/response');
const auth = require('../configs/auth.json');
const jwt = require("jsonwebtoken");


exports.authenticateJWT = async (req, res, next) => {
    const { token } = req.body;
    const { authorization } = req.headers;
    // console.log("Chheck auth: ", authorization);
  
    if (!authorization) {
      return res.status(GLOBAL_MESSAGE.UN_AUTH.STATUS_CODE).json({
        status: GLOBAL_MESSAGE.UN_AUTH.STATUS_CODE,
        message: GLOBAL_MESSAGE.UN_AUTH,
        
      });
    }
    else{
     const verificationToken =
      (authorization.split(" ").length ? authorization.split(" ")[1] : null) || token;
      await jwt.verify(verificationToken, auth.accessToken, (err, user) => {
        if (err) {
          res.status(GLOBAL_MESSAGE.FORBIDDEN.STATUS_CODE).json({
            status: GLOBAL_MESSAGE.FORBIDDEN.STATUS_CODE,
            message: GLOBAL_MESSAGE.FORBIDDEN,
            errorMsg: err,
          });
        } else {
            const token = jwt_decode(verificationToken);
            req.userInfo = token;
          next();
          
        }
      });
    }    
  };


  exports.isAdmin = (req, res, next) => {
    const { authorization } = req.headers;
  
    if (authorization) {
      var decoded = jwt_decode(authorization);
        if (decoded.roles.role === "admin" || decoded.roles.role === "super_admin") {
          next();
          return;
        }
      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    }
  };


exports.isUser = (req, res, next) => {
    const { authorization } = req.headers;
  
    if (authorization) {
      var decoded = jwt_decode(authorization);
        if (decoded.roles.role === "user") {
          next();
          return;
        }
      res.status(403).send({
        message: "Require User Role!",
      });
      return;
    }
  };

  exports.bothAccess = (req, res, next) => {
    const { authorization } = req.headers;
  
    if (authorization) {
      var decoded = jwt_decode(authorization);
        if (decoded.roles.role === "user" || decoded.roles.role === "admin") {
          next();
          return;
        }
      res.status(403).send({
        message: "Require User Role!",
      });
      return;
    }
  };

  exports.isSuperAdmin = (req, res, next) => {
    const { authorization } = req.headers;
  
    if (authorization) {
      var decoded = jwt_decode(authorization);
        if (decoded.roles.role === "super_admin") {
          next();
          return;
        }
      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    }
  };