const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {

    // get token from header
    const token = req.header('x-auth-token');

    // check if not token 
    if(!token) {
        return res.status(401).json({ msg:'NO token. authorization defined' });
  }
  //verify token 

  try {
      const decoded = jwt.verify(token, config.get(jetSecret));
      req.user = decoded.user;
      next();
  } catch(err) {
      res.status(401). json({ msg: 'Token is not valid'});

  }
}