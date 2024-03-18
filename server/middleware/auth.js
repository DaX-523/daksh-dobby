const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/config.env" });

module.exports = (req, res, next) => {
  let token = req.header("Authorization");
  // let token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjExLCJpYXQiOjE2OTc3NDQ4MTMsImV4cCI6MTY5Nzc4MDgxM30.A1gp8BR0T7CGZtQZaWRFItAKKF0wc2z7ji1vbsBaIqU";

  if (!token) {
    return res.status(403).json({
      errors: [
        {
          message: "Unauthorized",
        },
      ],
    });
  }

  token = token.split(" ")[1];

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODE", decodedUser);
    req.user = decodedUser._id;
    next();
  } catch (error) {
    return res.status(403).json({
      errors: [
        {
          message: error.message,
        },
      ],
    });
  }
};
