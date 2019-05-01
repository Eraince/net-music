(function() {
  // boolean
  let totalPlay = false;
  let playing = false;
  let brightness = "C2";
  let speed = "16n";

  const homeURL = "http://192.168.0.143:3000";
  const hotURL = "http://172.20.10.11:3000";
  const schoolURL = "http://149.31.124.227:3000";
  fetch(schoolURL + "/miParam", {
    method: "GET"
  })
    .then(function(response) {
      response.json().then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          brightness = data.brightness;
          speed = data.speed;
          snarePart.stop();
          updateSequence();
          snarePart.start();
        }
      });
    })
    .catch(error => console.error("Error:", error));
  const socket = io();

  // dom elements to animate

  const playBtn = document.getElementById("playbtn");
  const returnBtn = document.getElementById("return");
  const speedBtns = document.querySelectorAll(".speed-btn");
  const bRange = document.querySelector(".b-range");

  function sendUpdate() {
    socket.emit("play", {
      name: "banso",
      playing,
      brightness,
      speed
    });
  }

  function updateSequence() {
    snarePart = new Tone.Sequence(
      function(time, note) {
        // changeColor(kickBox);
        drums505.triggerAttackRelease(brightness, speed, time);
      },
      ["C5"],
      speed
    );
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
  var snarePart = new Tone.Sequence(
    function(time, note) {
      drums505.triggerAttackRelease(brightness, speed, time);
    },
    ["C5"],
    speed
  );

  // Route everything through the filter & compressor before playing
  Tone.Master.chain(lowBump, masterCompressor);

  /*
   * Tone Transport
   * set the beats per minute, volume, swing feel etc...
   */
  Tone.Transport.bpm.value = 50;
  Tone.Transport.loopStart = 0;

  /*
   * Play Controls
   */

  bRange.addEventListener("input", function() {
    brightness = bRange.value;
    brightness = "C" + brightness;
    updateSequence();
  });

  speedBtns.forEach(function(btn) {
    btn.addEventListener("click", e => {
      e.preventDefault();
      updateActive(e.target, "speed-btn");
      var choice = e.target.innerText;
      choice == "Fast" ? (speed = "32n") : (speed = "16n");
      snarePart.stop();
      updateSequence();
      snarePart.start();
    });
  });

  playBtn.addEventListener("click", e => {
    e.preventDefault();
    if (!totalPlay) {
      playing = true;
      totalPlay = true;
      snarePart.start();
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
