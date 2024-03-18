const User = require("../model/user");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: "dogstqheb",
  api_key: "925564371413136",
  api_secret: process.env.CLOUDINARY_API_KEY,
});

exports.fileUpload = async (req, res, next) => {
  try {
    const userid = req.user;
    const image = req.file;
    const { name } = req.body;
    console.log("name", req.file, name);
    if (!image) {
      return res.status(422).json({ message: "No image uploaded" });
    }
    const imageUrl = image.path;
    await User.upload(imageUrl, userid, name);
    const result = await cloudinary.uploader.upload(imageUrl);
    console.log("Image uploaded", result);
    return res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error.message);
  }
};
