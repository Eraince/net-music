(function() {
  // boolean
  let totalPlay = false;
  let snarePlay = false;

  const socket = io();

  // dom elements to animate

  const $snareBtn = document.getElementById("snare-btn");
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

  // Snare Sequence
  const snarePart = new Tone.Sequence(
    function(time, note) {
      drums505.triggerAttackRelease("D4", "4n", time);
    },
    ["D4"],
    "4n"
  );

  // Route everything through the filter & compressor before playing
  Tone.Master.chain(lowBump, masterCompressor);

  /*
   * Tone Transport
   * set the beats per minute, volume, swing feel etc...
   */
  Tone.Transport.bpm.value = 50;
  Tone.Transport.swing = 0;
  Tone.Transport.swingSubdivision = "16n";
  Tone.Transport.loopStart = 0;

  /*
   * Play Controls
   */

  $snareBtn.addEventListener("click", e => {
    e.preventDefault();
    if (!totalPlay) {
      totalPlay = true;
      Tone.Master.mute = false;
      Tone.Transport.start("+0.1");
      Tone.context.resume();
    }
    if (!snarePlay) {
      snarePlay = true;
      $snareBtn.value = "stop";
    } else {
      snarePlay = false;
      $snareBtn.value = "start";
    }

    if (snarePlay) {
      snarePart.start();
    } else {
      snarePart.stop();
    }

    socket.emit("play", { name: "snare", playing: snarePlay });
  });

  quitBtn.addEventListener("click", e => {
    snarePlay = false;
    socket.emit("play", { name: "snare", playing: snarePlay });
    window.location = "/";
  });
})();
