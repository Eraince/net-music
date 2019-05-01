const mongoose = require("mongoose");

const Instrument = mongoose.model("Instrument", {
  name: {
    type: String,
    required: true
  },
  playing: {
    type: Boolean,
    required: true
  },
  osc: {
    type: String
  },
  sustain: {
    type: Number
  },
  brightness: {
    type: String
  },
  speed: {
    type: String
  }
});

module.exports = Instrument;
