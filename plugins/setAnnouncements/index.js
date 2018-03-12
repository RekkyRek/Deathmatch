let BOT

const setAnnouncements = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }

  await BOT.database.setServerData(message.guild.id, 'announcements', message.channel.id)
  BOT.success(message)
}

const init = (bot) => {
  BOT = bot

  BOT.register('!setAnnouncements', setAnnouncements)
}

module.exports = {
  init
}
