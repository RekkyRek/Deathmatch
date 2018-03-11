let BOT

const setHome = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }

  await BOT.database.setServerData(message.guild.id, 'home', message.channel.id)
  BOT.success(message)
}

const init = (bot) => {
  BOT = bot

  BOT.register('!setHome', setHome)
}

module.exports = {
  init
}
