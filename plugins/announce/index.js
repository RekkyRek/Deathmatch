let BOT

const announce = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }

  let guildData = await BOT.database.getServerData(message.guild.id, 'announcements')

  const args = message.content.toLowerCase().split(' ').slice(1).join(' ')
  if (!args[0]) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `To whitelist a server, use \`!announce <Some Text Here>\``,
      color: BOT.colors.red
    })
    return
  }

  BOT.send(message.guild.channels.get(guildData), {
    title: 'Announcement',
    description: args,
    color: BOT.colors.blue
  })

  BOT.success(message)
}

const init = (bot) => {
  BOT = bot

  BOT.register('!announce', announce)
}

module.exports = {
  init
}
