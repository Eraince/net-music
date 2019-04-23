const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb://127.0.0.1:27017/music-band", {
  useNewUrlParser: true,
  useCreateIndex: true
});

module.exports = connect;
