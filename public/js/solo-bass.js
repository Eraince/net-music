(function() {
  // boolean
  let totalPlay = false;
  let bassPlay = false;

  const socket = io();

  // dom elements to animate

  const $bassBtn = document.getElementById("bass-btn");
  const quitBtn = document.getElementById("quit");

  // const $bpmRange = document.getElementById("bpm-range");
  // const $swingRange = document.getElementById("swing-range");
  // const $filterRange = document.getElementById("filter-range");

  // let bpm = $bpmRange.value;
  // let swing = $swingRange.value;
  // let filter = $filterRange.value;

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

  /*
   * Bass
   */
  const bassSynth = new Tone.MonoSynth({
    volume: -6,
    oscillator: {
      type: "fmsquare5",
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

  // Bass Sequence
  const bassPart = new Tone.Sequence(
    function(time, note) {
      bassSynth.triggerAttackRelease(note, "10hz", time);
    },
    bassNotes,
    "16n"
  );

  // Route everything through the filter & compressor before playing
  Tone.Master.chain(lowBump, masterCompressor);

  /*
   * Tone Transport
   * set the beats per minute, volume, swing feel etc...
   */
  Tone.Transport.bpm.value = 60;
  Tone.Transport.swing = 0;
  Tone.Transport.swingSubdivision = "16n";
  Tone.Transport.loopStart = 0;

  /*
   * Play Controls
   */

  $bassBtn.addEventListener("click", e => {
    e.preventDefault();
    if (!totalPlay) {
      totalPlay = true;
      Tone.Master.mute = false;
      Tone.Transport.start("+0.1");
      Tone.context.resume();
    }
    if (!bassPlay) {
      bassPlay = true;
      $bassBtn.value = "stop";
    } else {
      bassPlay = false;
      $bassBtn.value = "play";
    }

    if (bassPlay) {
      bassPart.start();
    } else {
      bassPart.stop();
    }

    socket.emit("play", { name: "bass", playing: bassPlay });
  });

  quitBtn.addEventListener("click", e => {
    bassPlay = false;
    socket.emit("play", { name: "bass", playing: bassPlay });
    window.location = "/";
  });
})();
