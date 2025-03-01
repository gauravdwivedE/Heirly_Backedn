const chalk = require("chalk")
const jwt = require("jsonwebtoken")

const authentication = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Token from cookies:", token); // Check if token is present

    if (!token) return res.status(401).send("Authorization token missing");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).send("Authorization token invalid");

    console.log("Decoded token:", decoded); // Check the decoded content
    req.user = decoded;
    next();
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).send(err);
  }
};

module.exports = authentication
