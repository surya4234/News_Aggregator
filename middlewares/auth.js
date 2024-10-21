const jwt = require('jsonwebtoken');
const jwtSecret = 'your_jwt_secret_key';

module.exports = function (req, res, next) {
  const token = req.cookies.token || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send('Unauthorized');
  }
};
