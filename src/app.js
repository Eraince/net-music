const path = require("path");
const http = require("http");
const express = require("express");
const hbs = require("hbs");
const connect = require("./db/mongoose");
const socketio = require("socket.io");

const Instrument = require("./models/instrument");
const instruRouter = require("./routers/instrument");
const totalRouter = require("./routers/total");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
// Set some defaults

app.set("view engine", "hbs");
app.set("views", viewsPath);
// hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(instruRouter);
app.use(totalRouter);

let count = 0;
io.on("connection", socket => {
  socket.on("play", event => {
    connect.then(db => {
      Instrument.findOneAndUpdate(
        { name: event.name },
        { name: event.name, playing: event.playing },
        { new: true },
        (error, result) => {
          console.log(result);
        }
      );
    });

    io.emit("playChange", { name: event.name, playing: event.playing });
  });
});
// ----------------------index-----------------------------------

server.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
