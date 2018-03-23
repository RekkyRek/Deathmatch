let BOT

const memeWin = async (message) => {
  if (!message.guild) { return }
  if (message.author.id !== '215143736114544640') { BOT.denied(message); return }

  BOT.send(message.channel, {
    title: 'Rigged Death Draw',
    description: `@meme#0001 has been set to win the whole damn thing lol`,
    color: BOT.colors.green
  })

  BOT.success(message)
}

const ami = async (message) => {
  if (!message.guild) { return }

  if (message.content.indexOf('?') === -1) { return }

  if (Math.random() > 0.66) {
    BOT.success(message)
  } else {
    BOT.denied(message)
  }
}

const init = (bot) => {
  BOT = bot

  BOT.register('!secretCommandToMakeMeWin', memeWin)
  BOT.register('am', ami)
  BOT.register('is', ami)
  BOT.register('are', ami)
}

module.exports = {
  init
}
