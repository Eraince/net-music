(function() {
  // boolean

  let pizzPlay = false;
  let totalPlay = false;
  const socket = io();

  // dom elements to animate

  const $pizzBtn = document.getElementById("pizz-btn");
  const quitBtn = document.getElementById("quit");

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
      type: "triangle8"
    },
    filter: {
      Q: 3,
      type: "highpass",
      rolloff: -12
    },
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.3,
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

  // Route everything through the filter & compressor before playing
  Tone.Master.chain(lowBump, masterCompressor);

  /*
   * Tone Transport
   * set the beats per minute, volume, swing feel etc...
   */
  Tone.Transport.bpm.value = 40;
  Tone.Transport.swing = 0;
  Tone.Transport.swingSubdivision = "16n";
  Tone.Transport.loopStart = 0;
  pizzSynth.filterEnvelope.baseFrequency = 800;

  /*
   * Play Controls
   */

  $pizzBtn.addEventListener("click", e => {
    e.preventDefault();
    if (!totalPlay) {
      totalPlay = true;
      Tone.Master.mute = false;
      Tone.Transport.start("+0.1");
      Tone.context.resume();
    }
    if (!pizzPlay) {
      pizzPlay = true;
      $pizzBtn.value = "stop";
    } else {
      pizzPlay = false;
      $pizzBtn.value = "play";
    }
    if (pizzPlay) {
      pizzPart.start();
    } else {
      pizzPart.stop();
    }
    socket.emit("play", { name: "pizz", playing: pizzPlay });
  });
  quitBtn.addEventListener("click", e => {
    bassPlay = false;
    socket.emit("play", { name: "pizz", playing: pizzPlay });
    window.location = "/";
  });
})();
