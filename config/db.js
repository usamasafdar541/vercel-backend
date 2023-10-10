const { mongoose } = require("mongoose");

const db = mongoose
  .connect(
    // "mongodb+srv://usamasafdar:12345@cluster0.6xbcsy9.mongodb.net/node-store?retryWrites=true",
    "mongodb+srv://usamasafdar:12345@cluster0.6xbcsy9.mongodb.net/contact-management?retryWrites=true",

    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err, "Failed To Connect to the Database ");
  });
module.exports = db;
