const express = require("express");
const cors = require("cors");
const app = express();
const mongoConnect = require("./utils/database").mongoConnect;
const multer = require("multer");
const path = require("path");
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
    );
  },
});
const upload = multer({ storage: storage, fileFilter: fileFilter });
require("dotenv").config();

const authController = require("./controllers/auth");
const fileController = require("./controllers/file");

const isAuth = require("./middleware/auth");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Auth

app.post("/api/v1/login", authController.postLogin);
app.post("/api/v1/register", authController.postRegister);

// Upload
app.post("/upload", isAuth, upload.single("image"), fileController.fileUpload);
app.get("/get-image", isAuth);

mongoConnect(() => {
  app.listen(4002, () => {
    console.log("App Running on port 4002");
  });
});
