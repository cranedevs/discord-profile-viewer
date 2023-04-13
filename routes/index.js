const express = require("express");
const route = express.Router();
const moment = require("moment")
const { canvas, createCanvas, loadImage, registerFont } = require("canvas");
const Jimp = require("jimp")
const path = require("path")
const { themes } = require("../config.js");

route.get("/", async (req, res) => {
  res.render('index')
});

route.get("/:id", async (req, res) => {
    const date = moment(Date.now()).format("YYYY")
    const id = req.params.id;
    let theme = req.query.theme || "black";
    const guild = req.crane.guilds.cache.get("830044697590366208");

    if(guild && !guild.members.cache.get(id)) return res.render(`404`, { errType: "Kullanıcı" })
    if(!themes.some(x => theme.includes(x))) return res.render('404', { errType: "Tema Tipi" })
    
    const member = guild.members.cache.get(id);
    let themeCode;
    let textColor;

    console.log(member.presence)

    switch (theme) {
        case "black":
            themeCode = "#000000"
            textColor = "#ffff"
            break;
        case "light":
            themeCode = "#ffffff"
            textColor = "#000000"
            break;
        case "dark":
            themeCode = "#36393e"
            textColor = "#ffffff"
            break;
        default:
            break;
    }

    const canvas = createCanvas(1000, 500);
    const ctx = canvas.getContext('2d');
    const borderRadius = 50;

    // Draw rounded rectangle
    registerFont("src/lemonmilk.otf", { family: 'Lemon Milk' });
    ctx.fillStyle = themeCode;
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(canvas.width - borderRadius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, borderRadius);
    ctx.lineTo(canvas.width, canvas.height - borderRadius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - borderRadius, canvas.height);
    ctx.lineTo(borderRadius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.fill();

    // Load images
    console.log(member.presence.activities.find(x => x.name === "Spotify"))

    if (member.presence.activities.some(x => x.name === "Code")) {
        const vsc = member.presence.activities.find(x => x.name === "Code");
        loadImage(vsc.assets.largeImageURL().replace(".webp", ".png")).then((image2) => {
            // Non-round image
            const image2Width = 100;
            const image2Height = 100;
            const image2X = canvas.width - borderRadius - image2Width;
            const image2Y = canvas.height - borderRadius - image2Height;
            ctx.drawImage(image2, 50, 250, image2Width, image2Height);
            ctx.fillStyle = textColor;
            ctx.font = '14px "Lemon Milk"'
            ctx.fillText(vsc.state ? vsc.state : "Not Found", 150, 280, 300);
            ctx.font = '10px "Lemon Milk"'
            ctx.fillText(vsc.details ? vsc.details : "Not Found", 150, 300, 300);
            ctx.font = '10px "Lemon Milk"'
            ctx.fillText(vsc.timestamps ? `${moment(Date.now() - (new Date(`${vsc.timestamps.start}`)).getTime()).format("HH:mm:ss")} saattir developer!` : "Not Found", 150, 330, 300);
        }).then(() => {
            loadImage(member.user.avatarURL().replace(".webp", ".png")).then( async (image1) => {
                ctx.font = '50px "Lemon Milk"'
                ctx.fillStyle = textColor;
                ctx.fillText(member.user.username, 230, 132)
                ctx.font = '15px "Lemon Milk"'
                ctx.fillText(member.presence.activities ? (member.presence.activities.some(x => x.name === "Custom Status") ? member.presence.activities.find(x => x.name === "Custom Status").state : "") : "", 240, 165)
                // Round image
                const image1Radius = borderRadius+30;
                const image1X = borderRadius;
                const image1Y = borderRadius;
                const img1Radius = 100;
                ctx.save();
                ctx.beginPath();
                ctx.arc(image1Radius + borderRadius, image1Radius + borderRadius, image1Radius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(image1, borderRadius, borderRadius, image1Radius * 2, image1Radius * 2);
                ctx.restore();

                const buffer = canvas.toBuffer('image/png');
                res.writeHead(200, {
                    'Content-Type': "image/png",
                    'Content-Length': buffer.length
                });
                res.end(buffer);
            })
        })
    } else if(member.presence.activities.some(x => x.name === "Spotify")) {
        const vsc = member.presence.activities.find(x => x.name === "Spotify");
        
        loadImage(vsc.assets.largeImageURL().replace(".webp", ".png")).then((image2) => {
            // Non-round image
            const image2Width = 100;
            const image2Height = 100;
            const image2X = canvas.width - borderRadius - image2Width;
            const image2Y = canvas.height - borderRadius - image2Height;
            ctx.drawImage(image2, 50, 250, image2Width, image2Height);
            ctx.fillStyle = textColor;
            ctx.font = '14px "Lemon Milk"'
            ctx.fillText(vsc.details ? vsc.details : "Not Found", 150, 280, 300);
            ctx.font = '10px "Lemon Milk"'
            ctx.fillText(vsc.state ? vsc.state : "Not Found", 150, 300, 300);
            ctx.font = '10px "Lemon Milk"'
            ctx.fillText(vsc.timestamps ? `${moment((new Date(`${vsc.timestamps.end}`)).getTime() - (new Date(`${vsc.timestamps.start}`)).getTime()).format("HH:mm:ss")} saattir developer!` : "Not Found", 150, 330, 300);
        })
    } else {
        ctx.font = '50px "Lemon Milk"'
        ctx.fillStyle = textColor;
        ctx.fillText(member.user.username, 230, 132)
        ctx.font = '15px "Lemon Milk"'
        ctx.fillText(member.presence.activities ? (member.presence.activities.some(x => x.name === "Custom Status") ? member.presence.activities.find(x => x.name === "Custom Status").state : "") : "", 240, 165)

        loadImage(member.user.avatarURL().replace(".webp", ".png")).then( async (image1) => {
            // Round image
            const image1Radius = borderRadius+30;
            const image1X = borderRadius;
            const image1Y = borderRadius;
            const img1Radius = 100;
            ctx.save();
            ctx.beginPath();
            ctx.arc(image1Radius + borderRadius, image1Radius + borderRadius, image1Radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(image1, borderRadius, borderRadius, image1Radius * 2, image1Radius * 2);
            ctx.restore();

            const buffer = canvas.toBuffer('image/png');
            res.writeHead(200, {
                'Content-Type': "image/png",
                'Content-Length': buffer.length
            });
            res.end(buffer);
        })
    }

    
    /* 
    loadImage(member.user.avatarURL().replace(".webp", ".png")).then((image1) => {
        // Round image
        const image1Radius = borderRadius+30;
        const image1X = borderRadius;
        const image1Y = borderRadius;
        const img1Radius = 100;
        ctx.save();
        ctx.beginPath();
        ctx.arc(image1Radius + borderRadius, image1Radius + borderRadius, image1Radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(image1, borderRadius, borderRadius, image1Radius * 2, image1Radius * 2);
        ctx.restore();
    }).then(() => {
        
        else {
            const buffer = canvas.toBuffer('image/png');
            res.writeHead(200, {
                'Content-Type': "image/png",
                'Content-Length': buffer.length
            });
            res.end(buffer);
        }
    })*/

});

module.exports = route;