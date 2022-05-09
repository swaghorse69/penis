const fs = require("fs");
var Scraper = require('images-scraper');
const Discord = require('discord.js');
var config = require("./config.json");
const {
    time
} = require("console");
const PREFIX = config.prefix
var counter = require('counter'),
    count = counter(0);

const client = new Discord.Client()
/*
                Image Scraper was coded by stiizzycat
                 Copyright (c) 2021 StiizzyCat#0001 
          I am not responsible for the users use of my code

*/

var Running = false
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const google = new Scraper({
    puppeteer: {
        headless: true,
    },
});

client.on("ready", () => {
    client.login(config.token);
    console.log('starting scripts .....')
    console.clear();
    console.log(`ready to go! ${client.user.tag}`)
    client.user.setActivity('Image Scrape Sim', {
        type: 'PLAYING'
    })
})


client.on("message", async message => {
    if (message.author.bot) return;
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    async function grabimages(searchterm) {
        const results = await google.scrape(searchterm);
        var cum = 0
        var init = setInterval(() => { 
            count.value += 1
            message.channel.send(results[count.value].url).catch(function (error) {  message.reply("No images were found for: " + searchterm)})
        cum++
        if(cum === 10) clearInterval(init), count = counter(0), Running = false, message.reply("Done fetching Images")
    }, 2000)
    }


    if (command === "scrape") {
        if(Running === true) return ("please wait your turn")
        var searchterm = args.join(" ")
        if (!searchterm) return message.reply("i need a searchterm")

        grabimages(searchterm)
        var Running = true
        message.reply("Grabing your images!")
    }
})
require('./Server')();
client.login(config.token);