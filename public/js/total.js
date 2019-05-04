(function() {
  // boolean
  let totalPlay = false;
  let bandoPlay = false;
  let banrePlay = false;
  let banmiPlay = false;
  let banfaPlay = false;
  let bansoPlay = false;
  let banlaPlay = false;

  const socket = io();
  const $playBtn = document.getElementById("play-btn");

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

  // Bass notes array
  const bassNotes = [
    ["F#3", "F#3"],
    null,
    ["F#3", "F#3"],
    null,
    ["F#3", "F#3"],
    null,
    null,
    null,
    ["F#3", "F#3"],
    null,
    null,
    null,
    ["F#3", "F#3"],
    null,
    null,
    null,
    ["E3", "E3"],
    null,
    ["E3", "E3"],
    null,
    ["E3", "E3"],
    null,
    null,
    null,
    ["E3", "E3"],
    null,
    null,
    null,
    ["E3", "E3"],
    null,
    null,
    null,
    ["F#3", "F#3"],
    null,
    ["F#3", "F#3"],
    null,
    ["F#3", "F#3"],
    null,
    null,
    null,
    ["F#3", "F#3"],
    null,
    null,
    null,
    ["F#3", "F#3"],
    null,
    null,
    null,
    ["G3", "G3"],
    null,
    ["G3", "G3"],
    null,
    ["G3", "G3"],
    null,
    null,
    null,
    ["G3", "G3"],
    null,
    null,
    null,
    ["G3", "G3"],
    null,
    null,
    null
  ];

  // Pizzicato notes array
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

  // Hi-hat notes array
  const highHatNotes = [
    ["G3", null],
    ["G3", null],
    [null, "G3"],
    [null, ["A3", null]],
    ["G3", null],
    ["G3", "G3"],
    ["G3", "G3"],
    ["G3", "G3"],
    ["G3", null],
    ["G3", null],
    [null, "G3"],
    [null, ["A3", null]],
    ["G3", null],
    ["G3", "G3"],
    ["G3", "G3"],
    ["G3", "G3"]
  ];

  // Kick notes array
  const kickNotes = ["C3", null, null, null, ["C3", "C3"], null, null, null];

  const sNotes = [["D5"], [null], [null], [null]];

  /*
   * Bass
   */
  const bassSynth = new Tone.MonoSynth({
    volume: -6,
    oscillator: {
      type: "sine8",
      modulationType: "triangle",
      modulationIndex: 2,
      harmonicity: 0.501
    },
    filter: {
      Q: 1,
      type: "lowpass",
      rolloff: -24
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.4,
      release: 2
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.8,
      release: 1.5,
      baseFrequency: 50,
      octaves: 4.4
    }
  }).chain(autoWah);

  /*
   * Drums
   */
  const drums505 = new Tone.Sampler(
    {
      D4: "snare.[mp3|ogg]",
      C3: "kick.[mp3|ogg]",
      G3: "hh.[mp3|ogg]",
      A3: "hho.[mp3|ogg]"
    },
    {
      volume: 0,
      release: 1,
      baseUrl: "/audio/505/"
    }
  ).chain(autoWah, phaser);

  /*
   * Pizz
   */
  const pizzSynth = new Tone.MonoSynth({
    volume: 0,
    oscillator: {
      type: "sawtooth"
    },
    filter: {
      Q: 3,
      type: "highpass",
      rolloff: -12
    },
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.5,
      release: 0.9
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

  // Bass Sequence
  const bassPart = new Tone.Sequence(
    function(time, note) {
      bassSynth.triggerAttackRelease(note, "10hz", time);
    },
    bassNotes,
    "16n"
  );

  // High-hat Sequence
  var highHatPart = new Tone.Sequence(
    function(time, note) {
      drums505.triggerAttackRelease("A2", "4n", time);
    },
    highHatNotes,
    "8n"
  );

  // Snare Sequence
  var snarePart = new Tone.Sequence(
    function(time, note) {
      drums505.triggerAttackRelease("C2", "4n", time);
    },
    ["D4"],
    "16n"
  );

  var snarePart2 = new Tone.Sequence(
    function(time, note) {
      drums505.triggerAttackRelease("D2", "8n", time);
    },
    sNotes,
    "8n"
  );

  // Kick Sequence
  var kickPart = new Tone.Sequence(
    function(time, note) {
      // changeColor(kickBox);
      drums505.triggerAttackRelease("G2", "4n", time);
    },
    kickNotes,
    "26n"
  );

  // Route everything through the filter & compressor before playing
  Tone.Master.chain(lowBump, masterCompressor);

  /*
   * Tone Transport
   */
  Tone.Transport.bpm.value = 40;
  Tone.Transport.loopStart = 0;
  /*
   * Play Controls
   */

  $playBtn.addEventListener("click", e => {
    e.preventDefault();
    if (!totalPlay) {
      totalPlay = true;
      Tone.Master.mute = false;
      Tone.Transport.start("+0.1");
      Tone.context.resume();
    }
  });

  var instruments = {
    bando: {
      name: "bando",
      playing: bandoPlay,
      playPart: pizzPart,
      osc: "sine",
      sustain: 0.5,
      brightness: "lowpass",
      synth: pizzSynth
    },
    banre: {
      name: "banre",
      playing: banrePlay,
      playPart: kickPart,
      brightness: "G2",
      speed: "16n"
    },
    banmi: {
      name: "banmi",
      playing: banmiPlay,
      playPart: highHatPart,
      brightness: "A2",
      speed: "8n"
    },
    banfa: {
      name: "banfa",
      playing: banfaPlay,
      playPart: bassPart,
      osc: "sine",
      sustain: 0.5,
      brightness: "lowpass",
      synth: bassSynth
    },
    banso: {
      name: "banso",
      playing: bansoPlay,
      playPart: snarePart,
      brightness: "C2",
      speed: "16n"
    },
    banla: {
      name: "banla",
      playing: banlaPlay,
      playPart: snarePart2,
      brightness: "D2",
      speed: "8n"
    }
  };

  socket.on("playChange", playStatus => {
    if (playStatus.name == "bando") {
      var instrument = instruments.bando;
      instrument.osc = playStatus.osc;
      instrument.synth.oscillator.type = instrument.osc;
      instrument.sustain = playStatus.sustain;
      instrument.synth.envelope.sustain = instrument.sustain;
      instrument.brightness = playStatus.brightness;
      instrument.synth.filter.type = instrument.brightness;

      if (playStatus.playing != instrument.playing) {
        if (playStatus.playing) {
          instrument.playPart.start();
          instrument.playing = true;
          waves[0].amplitude = 70;
        } else {
          instrument.playPart.stop();
          instrument.playing = false;
          waves[0].amplitude = 0;
        }
      }
    }

    if (playStatus.name == "banfa") {
      var instrument = instruments.banfa;
      instrument.osc = playStatus.osc;
      instrument.synth.oscillator.type = instrument.osc;
      instrument.sustain = playStatus.sustain;
      instrument.synth.envelope.sustain = instrument.sustain;
      instrument.brightness = playStatus.brightness;
      instrument.synth.filter.type = instrument.brightness;
      if (playStatus.playing != instrument.playing) {
        if (playStatus.playing) {
          instrument.playPart.start();
          instrument.playing = true;
          waves[3].amplitude = 50;
        } else {
          instrument.playPart.stop();
          instrument.playing = false;
          waves[3].amplitude = 0;
        }
      }
    }

    if (playStatus.name == "banre") {
      var instrument = instruments.banre;
      instrument.brightness = playStatus.brightness;
      instrument.speed = playStatus.speed;
      instrument.playPart.stop();
      instrument.playPart = new Tone.Sequence(
        function(time, note) {
          drums505.triggerAttackRelease(
            instrument.brightness,
            instrument.speed,
            time
          );
        },
        kickNotes,
        instrument.speed
      );
      instrument.playPart.start();

      if (playStatus.playing != instrument.playing) {
        if (playStatus.playing) {
          instrument.playPart.start();
          instrument.playing = true;
          waves[1].amplitude = 30;
        } else {
          instrument.playPart.stop();
          instrument.playing = false;
          waves[1].amplitude = 0;
        }
      }
    }

    if (playStatus.name == "banmi") {
      var instrument = instruments.banmi;
      instrument.brightness = playStatus.brightness;
      instrument.speed = playStatus.speed;
      instrument.playPart.stop();
      instrument.playPart = new Tone.Sequence(
        function(time, note) {
          drums505.triggerAttackRelease(
            instrument.brightness,
            instrument.speed,
            time
          );
        },
        highHatNotes,
        instrument.speed
      );
      instrument.playPart.start();

      if (playStatus.playing != instrument.playing) {
        if (playStatus.playing) {
          instrument.playPart.start();
          instrument.playing = true;
          waves[2].amplitude = 90;
        } else {
          instrument.playPart.stop();
          instrument.playing = false;
          waves[2].amplitude = 0;
        }
      }
    }

    if (playStatus.name == "banso") {
      var instrument = instruments.banso;
      instrument.brightness = playStatus.brightness;
      instrument.speed = playStatus.speed;
      instrument.playPart.stop();
      instrument.playPart = new Tone.Sequence(
        function(time, note) {
          drums505.triggerAttackRelease(
            instrument.brightness,
            instrument.speed,
            time
          );
        },
        instrument.brightness,
        instrument.speed
      );
      instrument.playPart.start();

      if (playStatus.playing != instrument.playing) {
        if (playStatus.playing) {
          instrument.playPart.start();
          instrument.playing = true;
          waves[4].amplitude = 70;
        } else {
          instrument.playPart.stop();
          instrument.playing = false;
          waves[4].amplitude = 0;
        }
      }
    }
    if (playStatus.name == "banla") {
      var instrument = instruments.banla;
      instrument.brightness = playStatus.brightness;
      instrument.speed = playStatus.speed;
      instrument.playPart.stop();
      instrument.playPart = new Tone.Sequence(
        function(time, note) {
          drums505.triggerAttackRelease(
            instrument.brightness,
            instrument.speed,
            time
          );
        },
        sNotes,
        instrument.speed
      );
      instrument.playPart.start();

      if (playStatus.playing != instrument.playing) {
        if (playStatus.playing) {
          instrument.playPart.start();
          instrument.playing = true;
          waves[5].amplitude = 80;
        } else {
          instrument.playPart.stop();
          instrument.playing = false;
          waves[5].amplitude = 0;
        }
      }
    }
  });
})();

// ----------------------canvas drawing--------------------------------------

const canvas = document.getElementById("canvas");

var waves = [
  {
    xspacing: 3,
    theta: 0.2,
    amplitude: 0,
    period: 400,
    yvalue: [],
    dx: 0,
    color: { r: 153, g: 153, b: 255 },
    speed: 0.1,
    offset: -250
  },
  {
    xspacing: 8,
    theta: 0.2,
    amplitude: 0,
    period: 200,
    yvalue: [],
    dx: 0,
    color: { r: 255, g: 153, b: 255 },
    speed: 0.2,
    offset: -190
  },
  {
    xspacing: 8,
    theta: 0.2,
    amplitude: 0,
    period: 200,
    yvalue: [],
    dx: 0,
    color: { r: 255, g: 153, b: 153 },
    speed: 0.15,
    offset: -100
  },
  {
    xspacing: 8,
    theta: 0.2,
    amplitude: 0,
    period: 200,
    yvalue: [],
    dx: 0,
    color: { r: 255, g: 204, b: 153 },
    speed: 0.21,
    offset: 0
  },
  {
    xspacing: 8,
    theta: 0.2,
    amplitude: 0,
    period: 200,
    yvalue: [],
    dx: 0,
    color: { r: 205, g: 255, b: 153 },
    speed: 0.17,
    offset: 60
  },
  {
    xspacing: 8,
    theta: 0.2,
    amplitude: 0,
    period: 200,
    yvalue: [],
    dx: 0,
    color: { r: 153, g: 255, b: 238 },
    speed: 0.11,
    offset: 120
  }
];
let img;
let qrcode;
let myFont;

function preload() {
  img = loadImage("/img/Bandollective_logo.png");
  myFont = loadFont("font/Montserrat-Bold.ttf");
  // qrcode = loadImage("/img/qrcode-hotspot.png");
}

function setup() {
  var drawing = createCanvas(innerWidth, innerHeight);
  drawing.parent("canvas");
  waves.forEach(wave => {
    w = width;
    wave.dx = (TWO_PI / wave.period) * wave.xspacing;
    wave.yvalues = new Array(floor(w / wave.xspacing));
  });
}

function draw() {
  background(26, 26, 26);
  image(img, width / 2 - 200, 30, 400, 125);
  // image(qrcode, width / 2 - 100, 710, 200, 200);
  fill(255);
  textSize(32);
  text(
    "Join this performance by scanning the QR code with your phone.",
    width / 3 - 120,
    800
  );
  waves.forEach(wave => {
    calcWave(wave);
    renderWave(wave);
  });
}

function calcWave(wave) {
  // Increment theta (try different values for
  // 'angular velocity' here)
  wave.theta += wave.speed;

  let x = wave.theta;
  for (let i = 0; i < wave.yvalues.length; i++) {
    // wave.yvalues[i] = sin(x) * wave.amplitude + wave.offset * noise(x);
    wave.yvalues[i] =
      sin(x) * wave.amplitude + wave.offset + random(15) * noise(x);
    x += wave.dx;
  }
}

function renderWave(wave) {
  noStroke();
  // A simple way to draw the wave with an ellipse at each location
  for (let x = 0; x < wave.yvalues.length; x++) {
    fill(wave.color.r, wave.color.g, wave.color.b);
    ellipse(x * wave.xspacing, height / 2 + wave.yvalues[x], 7, 7);
  }
}

// ------------------------------------------------------------
