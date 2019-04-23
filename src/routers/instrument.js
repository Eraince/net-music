const express = require("express");
const Instrument = require("../models/instrument");
const connect = require("./../db/mongoose");

const router = new express.Router();

router.get("/pizz", async (req, res) => {
  try {
    res.render("solo-pizz", {
      title: "pizz"
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/bass", async (req, res) => {
  try {
    res.render("solo-bass", {
      title: "bass"
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/highHat", async (req, res) => {
  try {
    res.render("solo-highHat", {
      title: "highHat"
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/snare", async (req, res) => {
  try {
    res.render("solo-snare", {
      title: "snare"
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/kick", async (req, res) => {
  try {
    res.render("solo-kick", {
      title: "bass"
    });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
