const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config();

exports.postRegister = async (req, res, next) => {
  const { email, password, name } = req.body;
  let jwtToken;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User(name, email, hashedPassword, []);
      await user.save();
      jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10h",
      });
      return res.status(200).json({
        message: "Register successful",
        userData: user,
        token: jwtToken,
      });
    } else {
      return res.status(409).json({ message: "User already exists" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  let jwtToken;
  try {
    const user = await User.findOne(email);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(403).json({ message: "Incorrect password" });
    }
    jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    return res
      .status(200)
      .json({ message: "Login successful", userData: user, token: jwtToken });
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
};
