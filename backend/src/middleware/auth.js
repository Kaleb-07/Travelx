const jwt = require('jsonwebtoken');

/**
 * JWT verification middleware.
 * Reads the Authorization: Bearer <token> header, verifies the token
 * using JWT_SECRET, and attaches req.userId for downstream handlers.
 * Returns HTTP 401 on missing, expired, or malformed tokens.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed. Expected: Bearer <token>' });
  }

  const token = authHeader.slice(7); // strip "Bearer "

  if (!token) {
    return res.status(401).json({ message: 'Token is missing from Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = Number(decoded.userId);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token. Authentication failed.' });
  }
}

module.exports = authMiddleware;
