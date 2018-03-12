const EventEmitter = require('events')
const Discord = require('discord.js')

const Database = require('./database.js')

class Bot extends EventEmitter {
  constructor (client) {
    super()
    this.client = client
    this.database = new Database(this)

    this.colors = require('./colors.json')

    this.listeners = {}

    this.plugins = require('./plugins.js')()
    this.plugins.forEach(plugin => {
      plugin.init(this)
    })

    this.client.on('message', this.handleMessage.bind(this))

    this.initDiscordEvents()
    setInterval(() => this.emit('FUNC_pulse'), 1 * 1000 * 15)
  }

  async isOp (message) {
    return new Promise(async (resolve, reject) => {
      if (!message.guild) { return }
      let adminRoles = await this.database.getServerData(message.guild.id, 'adminRoles')
      Object.keys(adminRoles).forEach(role => {
        if (adminRoles[role]) {
          if (message.member._roles.indexOf(role) > -1) {
            resolve(true)
          }
        }
      })

      resolve(false)
    })
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
    return channel.send(new Discord.RichEmbed(data))
  }

  success (message) { message.react('✅') }
  denied (message) { message.react('❌') }

  initDiscordEvents () {
    require('./events.json').forEach(eventKey =>
      this.client.on(eventKey, (argumentOne, argumentTwo) =>
        this.emit(`FUNC_${eventKey}`, argumentOne, argumentTwo)
      )
    )
  }
}

module.exports = Bot
