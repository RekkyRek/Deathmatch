let BOT

const setHome = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }

  await BOT.database.setServerData(message.guild.id, 'revive_home', message.channel.id)
  BOT.success(message)
}

const init = (bot) => {
  BOT = bot

  BOT.register('!setReviveHome', setHome)
}

module.exports = {
  init
}
