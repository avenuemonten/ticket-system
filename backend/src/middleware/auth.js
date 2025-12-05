const jwt = require('jsonwebtoken');

function auth(requiredRole = null) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // payload: { userId, username, role, displayName, department }
      req.user = payload;

      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (err) {
      console.error('JWT error:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

module.exports = auth;