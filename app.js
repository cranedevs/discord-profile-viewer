const express = require("express");
const app = express();
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const path = require("path");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const indexRoute = require("./routes/index");
const config = require("./config")

const client = new Client({
    intents: Object.keys(GatewayIntentBits),
    partials: Object.keys(Partials)
});

client.on("ready", async () => {
    console.log("Hazır!");
});


client.login(config.token);

app.use((req, res, next) => {
    req.crane = client;
    next();
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı`);
});

app.use("/", indexRoute);