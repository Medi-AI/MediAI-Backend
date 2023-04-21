const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = require("../config");

const auth = (req, res, next) => {
  const token = req.header("mediai-auth-token");
  if (!token) return res.status(401).send("Access denied. No token available.");

  try {
    const decoded = jwt.verify(token, jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};

module.exports = auth;
