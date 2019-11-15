const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    // call next middleware
    next();
  } else {
    res.status(403).json({ msg: `unathorized` });
  }
};

const isAdmin = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(req.token, 'secretkey', (error, data) => {
      if (error) {
        res.status(503).json({
          status: 'error',
          error: 'unable to verify user'
        });
      } else {
        const { user } = data;
        const { mail } = user;
        if (mail !== 'simonnabuko@gmail.com') {
          res.status(503).json({
            status: 'error!',
            error: 'You are not authorized to access protected route'
          });
        } else {
          // call next middleware
          next();
        }
      }
    });
  } else {
    res.status(403).json({ msg: `unathorized` });
  }
};
module.exports = {
  verifyUser,
  isAdmin
};
