(function() {
  const homeURL = "http://192.168.0.143:3000";
  const hotURL = "http://172.20.10.11:3000";
  const schoolURL = "http://149.31.124.44:3000";
  fetch(hotURL + "/status", {
    method: "GET"
  })
    .then(function(response) {
      response.json().then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          createButton(data.bando, "bando");
          createButton(data.banre, "banre");
          createButton(data.banmi, "banmi");
          createButton(data.banfa, "banfa");
          createButton(data.banso, "banso");
          createButton(data.banla, "banla");
        }
      });
    })
    .catch(error => console.error("Error:", error));
})();

const createButton = (status, name) => {
  var parentBox = document.createElement("div");
  parentBox.className = "ins-choose";
  if (status) {
    parentBox.id = name + "-filled";
  } else {
    parentBox.id = name;
  }
  var childBox = document.createElement("div");
  childBox.className = "ins-button";
  var linkBox = document.createElement("a");
  if (status) {
    linkBox.innerHTML = "In Performance";
    linkBox.href = "/";
  } else {
    linkBox.innerHTML = name;
    linkBox.href = "/" + name;
  }
  childBox.append(linkBox);
  parentBox.append(childBox);
  var controls = document.getElementById("music-controls");
  controls.append(parentBox);
};
