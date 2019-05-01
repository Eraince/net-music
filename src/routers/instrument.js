const express = require("express");
const Instrument = require("../models/instrument");
const connect = require("./../db/mongoose");

const router = new express.Router();

router.get("/bando", async (req, res) => {
  try {
    res.render("bando", {
      title: "bando"
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/doParam", async (req, res) => {
  try {
    Instrument.findOne({ name: "bando" }).then(instrument => {
      res.json({
        name: instrument.name,
        playing: instrument.playing,
        osc: instrument.osc,
        sustain: instrument.sustain,
        brightness: instrument.brightness
      });
    });
  } catch (e) {
    console.log("index error");
  }
});

router.get("/banfa", async (req, res) => {
  try {
    res.render("banfa", {
      title: "banfa"
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/faParam", async (req, res) => {
  try {
    Instrument.findOne({ name: "banfa" }).then(instrument => {
      res.json({
        name: instrument.name,
        playing: instrument.playing,
        osc: instrument.osc,
        sustain: instrument.sustain,
        brightness: instrument.brightness
      });
    });
  } catch (e) {
    console.log("index error");
  }
});

router.get("/banmi", async (req, res) => {
  try {
    res.render("banmi", {
      title: "banmi"
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/miParam", async (req, res) => {
  try {
    Instrument.findOne({ name: "banmi" }).then(instrument => {
      res.json({
        name: instrument.name,
        playing: instrument.playing,
        speed: instrument.speed,
        brightness: instrument.brightness
      });
    });
  } catch (e) {
    console.log("index error");
  }
});

router.get("/banso", async (req, res) => {
  try {
    res.render("banso", {
      title: "banso"
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/soParam", async (req, res) => {
  try {
    Instrument.findOne({ name: "banso" }).then(instrument => {
      res.json({
        name: instrument.name,
        playing: instrument.playing,
        speed: instrument.speed,
        brightness: instrument.brightness
      });
    });
  } catch (e) {
    console.log("index error");
  }
});

router.get("/banre", async (req, res) => {
  try {
    res.render("banre", {
      title: "banre"
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/reParam", async (req, res) => {
  try {
    Instrument.findOne({ name: "banre" }).then(instrument => {
      res.json({
        name: instrument.name,
        playing: instrument.playing,
        speed: instrument.speed,
        brightness: instrument.brightness
      });
    });
  } catch (e) {
    console.log("index error");
  }
});

router.get("/banla", async (req, res) => {
  try {
    res.render("banla", {
      title: "banla"
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/reParam", async (req, res) => {
  try {
    Instrument.findOne({ name: "banre" }).then(instrument => {
      res.json({
        name: instrument.name,
        playing: instrument.playing,
        speed: instrument.speed,
        brightness: instrument.brightness
      });
    });
  } catch (e) {
    console.log("index error");
  }
});

module.exports = router;
