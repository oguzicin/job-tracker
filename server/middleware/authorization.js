const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {

    const token = req.header("token");

    if (!token) {
      return res.status(403).json({ msg: "Authorization denied, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Token invalid" });
  }
};