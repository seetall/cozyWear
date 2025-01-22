const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret key
    req.user = decoded; // Attach the decoded token payload (user info) to req.user
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid Token!" });
  }
};

module.exports = authenticateUser;
