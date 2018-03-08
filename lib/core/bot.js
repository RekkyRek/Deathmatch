const EventEmitter = require('events')
const Discord = require('discord.js')

const Database = require('./database.js')

class Bot extends EventEmitter {
  constructor (client) {
    super()
    this.client = client
    this.database = new Database()

    this.colors = require('./colors.json')

    this.listeners = {}

    this.plugins = require('./plugins.js')()
    this.plugins.forEach(plugin => {
      plugin.init(this)
    })

    this.client.on('message', this.handleMessage.bind(this))
    this.initDiscordEvents()
  }

  register (key, callback) {
    if (this.listeners[key]) { return new Error('ALREADY_IN_USE') }

    this.listeners[key] = callback
    this.on(key, callback)
  }

  drop (key) {
    if (!this.listeners[key]) { return new Error('LISTENER_NOT_FOUND') }

    this.removeListener(key, this.listeners[key])
    this.listeners[key] = undefined
  }

  handleMessage (message) {
    if (message.author === this.client.user) { return }
    this.emit(message.content.split(' ')[0], message)
  }

  send (channel, data) {
    channel.send(new Discord.RichEmbed(data))
  }

  initDiscordEvents () {
    require('./events.json').forEach(eventKey =>
      this.client.on(eventKey, (argumentOne, argumentTwo) =>
        this.emit(`FUNC_${eventKey}`, argumentOne, argumentTwo)
      )
    )
  }
}

module.exports = Bot
