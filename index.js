const path = require('path')
global.appRoot = path.resolve(__dirname)

const Bot = require('./lib/core/bot.js')

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  const bot = new Bot(client)
  console.log(`Connected as ${bot.client.user.tag}`)
})

client.login(require('../gasbot.json').token)
