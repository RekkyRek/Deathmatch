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
  if (message.author.id !== '215143736114544640') { return }

  if (Math.random() > 0.66) {
    BOT.success(message)
  } else {
    BOT.denied(message)
  }
}

let lastPoggers = Date.now()

const poggers = async (message) => {
  if ((Date.now() - lastPoggers) / 1000 > 600) {
    BOT.send(message.channel, {
      color: 3553598,
      title: 'poggers',
      image: 'https://cdn.discordapp.com/attachments/409998879518621697/427078316185485322/f49fb480f9131d269e39058cb9d77065.jpg'
    })
    lastPoggers = Date.now()
  }
}

const init = (bot) => {
  BOT = bot

  BOT.register('!secretCommandToMakeMeWin', memeWin)
  BOT.register('am', ami)
  BOT.register('is', ami)
  BOT.register('are', ami)
  BOT.register('poggers', poggers)
}

module.exports = {
  init
}
