(function() {
  const homeURL = "http://192.168.0.143:3000";
  const hotURL = "http://172.20.10.11:3000";
  const schoolURL = "http://149.31.124.174:3000";
  fetch(homeURL + "/status", {
    method: "GET"
  })
    .then(function(response) {
      response.json().then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          createBall(data.pizz, "pizz");
          createBall(data.bass, "bass");
          createBall(data.snare, "snare");
          createBall(data.kick, "kick");
          createBall(data.highHat, "highHat");
        }
      });
    })
    .catch(error => console.error("Error:", error));
})();

const createBall = (status, name) => {
  var parentBox = document.createElement("div");
  parentBox.style.margin = "3%";
  if (status) {
    parentBox.className = "ball bubble";
  } else {
    parentBox.className = "ball";
  }
  var childBox = document.createElement("div");
  childBox.style.textAlign = "center";
  childBox.style.paddingTop = "50%";
  childBox.style.fontSize = "1.5em";
  var linkBox = document.createElement("a");
  linkBox.style.marginTop = "50%";
  if (status) {
    linkBox.innerHTML = "In Use";
    linkBox.href = "/";
  } else {
    linkBox.innerHTML = name;
    linkBox.href = "/" + name;
  }
  childBox.append(linkBox);
  parentBox.append(childBox);
  var stage = document.getElementById("stage");
  stage.append(parentBox);
};
