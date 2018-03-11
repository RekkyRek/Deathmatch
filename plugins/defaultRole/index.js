let BOT

const setDefaultRole = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }

  let roleName = message.content.split('!setDefaultRole ')[1]
  let role = message.guild.roles.find('name', roleName)

  if (!role) { role = message.guild.roles.get(roleName) }

  if (role) {
    BOT.database.setServerData(message.guild.id, 'defaultRole', role.id)
    BOT.send(message.channel, {
      title: 'Set Default Role',
      description: `**${roleName}** has successfully been set as the default role.`,
      color: BOT.colors.green
    })
  } else {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `I couldn't find the role **${roleName}**.`,
      color: BOT.colors.red
    })
  }
}

const assignDefaultRole = async (user) => {
  console.log(user)
  let serverData = await BOT.database.getServerData(user.guild.id, 'defaultRole')
  if (!serverData) { return }

  const role = user.guild.roles.get(serverData.defaultRole)
  if (role) {
    user.addRole(role).catch(console.error)
  }
}

const init = (bot) => {
  BOT = bot

  BOT.register('!setDefaultRole', setDefaultRole)
  BOT.on('FUNC_guildMemberAdd', assignDefaultRole)
}

module.exports = {
  init
}
