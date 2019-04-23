const express = require("express");
const connect = require("../db/mongoose");

const Instrument = require("../models/instrument");

const router = new express.Router();

router.get("", (req, res) => {
  try {
    Instrument.find({}).then(instruments => {
      var playList = {
        pizz: instruments[0].playing,
        bass: instruments[1].playing,
        snare: instruments[2].playing,
        kick: instruments[3].playing,
        highHat: instruments[4].playing
      };
      res.render("index", {
        pizz: playList.pizz ? "In Use" : "Join Pizz",
        bass: playList.bass ? "In Use" : "Join Bass",
        snare: playList.snare ? "In Use" : "Join Snare",
        kick: playList.kick ? "In Use" : "Join Kick",
        highHat: playList.highHat ? "In Use" : "Join highHat"
      });
    });
  } catch (e) {
    console.log("index error");
  }
});

router.get("/status", (req, res) => {
  try {
    Instrument.find({}).then(instruments => {
      res.json({
        pizz: instruments[0].playing,
        bass: instruments[1].playing,
        snare: instruments[2].playing,
        kick: instruments[3].playing,
        highHat: instruments[4].playing
      });
    });
  } catch (e) {
    console.log("index error");
  }
});

router.get("/total", async (req, res) => {
  try {
    res.render("total", {
      title: "total"
    });
  } catch (e) {
    console.log("index error");
  }
});

module.exports = router;
