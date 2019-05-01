(function() {
  // boolean
  let totalPlay = false;
  var playing = false;
  var osc = "sine";
  var sustain = 0.5;
  var brightness = "lowpass";

  const homeURL = "http://192.168.0.143:3000";
  const hotURL = "http://172.20.10.11:3000";
  const schoolURL = "http://149.31.124.156:3000";
  fetch(homeURL + "/doParam", {
    method: "GET"
  })
    .then(function(response) {
      response.json().then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          osc = data.osc;
          brightness = data.brightness;
          sustain = data.sustain;
        }
      });
    })
    .catch(error => console.error("Error:", error));

  const socket = io();

  // dom elements to animate

  const playBtn = document.getElementById("playbtn");
  const returnBtn = document.getElementById("return");
  const oscBtns = document.querySelectorAll(".osc-btn");
  const briBtns = document.querySelectorAll(".bri-btn");
  const sRange = document.querySelector(".s-range");

  function sendUpdate() {
    socket.emit("play", {
      name: "bando",
      playing,
      osc,
      sustain,
      brightness
    });
  }

  /*
   * Effects
   * Connect change instrument .toMaster() to .connect(effectname);
   */
  const autoWah = new Tone.AutoWah({
    baseFrequency: 90,
    octaves: 8,
    sensitivity: 0.1,
    Q: 6,
    gain: 3,
    follower: {
      attack: 0.1,
      release: 0.2
    },
    wet: 0.3
  }).toMaster();
  autoWah.Q.value = 3;

  const phaser = new Tone.Phaser({
    frequency: 0.1,
    octaves: 6,
    stages: 10,
    Q: 3,
    baseFrequency: 350,
    wet: 0.3
  }).toMaster();

  const chorus = new Tone.Chorus({
    frequency: 1.5,
    delayTime: 3.5,
    depth: 0.7,
    type: "sine",
    spread: 180,
    wet: 0.3
  });

  /*
   * Delay
   */
  const pingPong = new Tone.PingPongDelay({
    delayTime: "12n",
    maxDelayTime: 1,
    wet: 0.1
  }).toMaster();

  /*
   * Master FX
   */
  //some overall compression to keep the levels in check
  const masterCompressor = new Tone.Compressor({
    threshold: -20,
    ratio: 12,
    attack: 0,
    release: 0.3
  });

  //give a little boost to the lows
  const lowBump = new Tone.Filter({
    type: "lowshelf",
    frequency: 90,
    Q: 1,
    gain: 20
  });

  /*
   * Pizz
   */

  const pizzNotes = [
    "C#4",
    ["D4", "C#4"],
    ["C#4", "D4"],
    ["C#4", "C#4"],
    ["D4", "C#4"],
    ["C#4", "C#4"],
    ["B#3", "C#4"],
    ["C#4", "C#4"],
    "C#4",
    ["D4", "C#4"],
    ["C#4", "D4"],
    ["C#4", "C#4"],
    ["D4", "C#4"],
    ["C#4", "C#4"],
    ["B#3", "C#4"],
    ["C#4", "C#4"],
    "B3",
    ["B#3", "B3"],
    ["B3", "B#3"],
    ["B3", "B3"],
    ["B#3", "B3"],
    ["B3", "B3"],
    ["A#3", "B3"],
    ["B3", "B3"],
    "B3",
    ["B#3", "B3"],
    ["B3", "B#3"],
    ["B3", "B3"],
    ["B#3", "B3"],
    ["B3", "B3"],
    ["A#3", "B3"],
    ["B3", "B3"]
  ];
  const pizzSynth = new Tone.MonoSynth({
    volume: 0,
    oscillator: {
      type: osc
    },
    filter: {
      Q: 3,
      type: brightness,
      rolloff: -12
    },
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: sustain,
      release: 0.2
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0,
      release: 0.1,
      baseFrequency: 800,
      octaves: -1.2
    }
  }).chain(pingPong, chorus);

  /*
   * Sequence Parts
   */
  const pizzPart = new Tone.Sequence(
    function(time, note) {
      pizzSynth.triggerAttackRelease(note, "10hz", time);
    },
    pizzNotes,
    "16n"
  );

  // Route everything through the filter & compressor before playing
  Tone.Master.chain(lowBump, masterCompressor);
  /*
   * Tone Transport
   * set the beats per minute, volume, swing feel etc...
   */
  Tone.Transport.bpm.value = 40;
  Tone.Transport.loopStart = 0;

  /*
   * Play Controls
   */

  oscBtns.forEach(function(btn) {
    btn.addEventListener("click", e => {
      e.preventDefault();
      updateActive(e.target, "osc-btn");
      osc = e.target.innerText;
      pizzSynth.oscillator.type = osc;
    });
  });

  briBtns.forEach(function(btn) {
    btn.addEventListener("click", e => {
      e.preventDefault();
      updateActive(e.target, "bri-btn");
      var choice = e.target.innerText;
      choice == "Bright" ? (brightness = "highpass") : (brightness = "lowpass");
      pizzSynth.filter.type = brightness;
    });
  });

  sRange.addEventListener("input", function() {
    sustain = sRange.value;
    pizzSynth.envelope.sustain = sustain;
  });

  playBtn.addEventListener("click", e => {
    e.preventDefault();
    if (!totalPlay) {
      playing = true;
      totalPlay = true;
      pizzPart.start();
      playBtn.innerText = "update";
      Tone.Master.mute = false;
      Tone.Transport.start("+0.1");
      Tone.context.resume();
    }
    sendUpdate();
  });

  returnBtn.addEventListener("click", e => {
    e.preventDefault();
    playing = false;
    sendUpdate();
    window.location = "/";
  });
})();

function updateActive(target, typeName) {
  var elems = document.querySelectorAll(".active");
  [].forEach.call(elems, function(el) {
    if (el.classList.contains(typeName)) {
      el.classList.remove("active");
    }
  });
  target.classList.add("active");
}
