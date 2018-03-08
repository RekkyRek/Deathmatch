const EventEmitter = require('events')

class Bot extends EventEmitter {
  constructor (client) {
    super()
    this.client = client
    this.listeners = {}

    this.plugins = require('./plugins.js')()
    this.plugins.forEach(plugin => {
      plugin.init(this)
    })

    this.client.on('message', this.handleMessage.bind(this))
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
}

module.exports = Bot
