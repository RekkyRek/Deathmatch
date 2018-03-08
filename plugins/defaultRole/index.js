let BOT

const setDefaultRole = (message) => {
  let roleName = message.content.split('!setDefaultRole ')[1]
  let role = message.guild.roles.find('name', roleName)

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
      description: `I couldn't find the role **${roleName}**. You can try entering the ID manually if you know that's the correct name.`,
      color: BOT.colors.red
    })
  }
}

const assignDefaultRole = async (user) => {
  console.log(user)
  let serverData = await BOT.database.getServerData(user.guild.id, 'defaultRole')
  if (!serverData && !serverData.defaultRole) { return }

  const role = user.guild.id.roles.get(serverData.defaultRole)
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
