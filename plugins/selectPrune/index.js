let BOT

const setOp = async (message) => {
  if (!message.guild) { return }
  if (message.guild.owner !== message.member) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `Only the server owner can use \`!setOp <true|false> <Role Name>\`.`,
      color: BOT.colors.red
    })
    return
  }

  const isOp = message.content.split(' ')[1].toLowerCase()
  const roleName = message.content.split(' ').splice(2).join(' ')
  let role = message.guild.roles.find('name', roleName)

  if (!role) { role = message.guild.roles.get(roleName) }

  let adminRoles = await BOT.database.getServerData(message.guild.id, 'adminRoles')
  if (!adminRoles) { adminRoles = {} }

  if (role) {
    adminRoles[role.id] = isOp === 'true'
    BOT.database.setServerData(message.guild.id, 'adminRoles', adminRoles)
    BOT.send(message.channel, {
      title: 'Set Default Role',
      description: `**${roleName}** has successfully been set as a bot operator role.`,
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

const init = (bot) => {
  BOT = bot

  BOT.register('!setOp', setOp)
}

module.exports = {
  init
}
