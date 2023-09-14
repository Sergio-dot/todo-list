const jwt = require('jsonwebtoken');
const redisClient = require('../modules/redis.module');

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('[VERIFY_TOKEN] Token: ', token);

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userData = decoded;
    console.log('[VERIFY_TOKEN] REQ - User data: ', req.userData);

    req.token = token;
    console.log('[VERIFY_TOKEN] REQ - Token: ', req.token);

    // Check if token is blacklisted
    redisClient.get('BL_' + decoded.sub.toString(), (err, data) => {
      if (err) {
        throw err;
      }

      console.log('[VERIFY_TOKEN] Data: ', data);

      if (data === token) {
        return res
          .status(401)
          .json({ status: false, message: 'Token is blacklisted' });
      }
    });

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: 'Invalid session', data: error });
  }
}

function verifyRefreshToken(req, res, next) {
  const token = req.body.token;
  console.log('[VERIFY_REFRESH_TOKEN] Token: ', token);

  if (token === null) {
    return res.status(401).json({ status: false, message: 'Invalid request' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.userData = decoded;
    console.log('[VERIFY_REFRESH_TOKEN] REQ - User data: ', req.userData);

    // check if token is in store or not
    console.log('hit -1');
    console.log(decoded.sub.toString());
    redisClient.get(decoded.sub.toString(), (err, data) => {
      console.log('hit 0');

      if (err) {
        throw err;
      }

      console.log('hit 1');

      console.log('[VERIFY_REFRESH_TOKEN] Data: ', data);
      if (data === null) {
        return res.status(401).json({
          status: false,
          message: 'Invalid request. Token is not stored',
        });
      }

      console.log('hit 2');

      if (JSON.parse(data).token != token) {
        return res.status(401).json({
          status: false,
          message: 'Invalid request. Token is outdated',
        });
      }

      next();
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: 'Invalid session', data: error });
  }
}

module.exports = {
  verifyToken,
  verifyRefreshToken,
};
