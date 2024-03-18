const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email, password, imageurls) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.imageurls = imageurls;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  static findOne(email) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ email: email })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static upload(url, userid, name) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userid) })
      .then((user) => {
        if (!user) {
          throw new Error("User not found");
        }
        const updatedImageUrls = user.imageurls
          ? [...user.imageurls, { url, name }]
          : [{ url, name }];
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(userid) },
            { $set: { imageurls: updatedImageUrls } }
          );
      })
      .then((result) => {
        console.log("User updated successfully", result);
        return result;
      })
      .catch((err) => {
        console.log("Error updating user", err);
        throw err;
      });
  }

  static saveImgUrl(url) {
    const db = getDb();
    return db.collection("users");
  }

  static fetchImage(userid) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userid) })
      .then((user) => {
        return user.imageurls;
      });
  }
}

module.exports = User;
