const express = require("express");
const connect = require("../db/mongoose");

const Instrument = require("../models/instrument");

const router = new express.Router();

router.get("", (req, res) => {
  try {
    res.render("index");
  } catch (e) {
    console.log("index error");
  }
});

router.get("/status", (req, res) => {
  try {
    Instrument.find({}).then(instruments => {
      res.json({
        bando: instruments[0].playing,
        banre: instruments[1].playing,
        banmi: instruments[2].playing,
        banfa: instruments[3].playing,
        banso: instruments[4].playing,
        banla: instruments[5].playing
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
