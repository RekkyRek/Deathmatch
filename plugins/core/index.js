let BOT

const init = (bot) => {
  BOT = bot

  BOT.register('hi', (message) => { message.channel.send('hello') })
}

module.exports = {
  init
}
