const mongoose = require("mongoose");

const Instrument = mongoose.model("Instrument", {
  name: {
    type: String,
    required: true
  },
  playing: {
    type: Boolean,
    required: true
  }
});

module.exports = Instrument;
