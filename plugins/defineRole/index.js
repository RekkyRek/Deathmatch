let BOT

const defineRole = async (message) => {
  const roleDef = message.content.split(' ')[1].toLowerCase()
  const roleName = message.content.split(' ').splice(2).join(' ')

  if (!message.guild) { return }

  if (
    !roleDef ||
    !roleName ||
    require('../roles.json').indexOf(roleDef) === -1
  ) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `To define a role, use \`!defineRole <${
        require('../roles.json').join('|')
      }> <Role Name>\``,
      color: BOT.colors.red
    })
    return
  }

  let role = message.guild.roles.find('name', roleName)
  if (!role) { role = message.guild.roles.get(roleName) }

  if (role) {
    BOT.database.setServerData(message.guild.id, `role_${roleDef}`, role.id)
      .then((data) => {
        BOT.success(message)
      })
      .catch((err) => {
        BOT.send(message.channel, {
          title: 'Database Error',
          description: err,
          color: BOT.colors.red
        })
      })
  } else {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `I couldn't find the role **${roleName}**.`,
      color: BOT.colors.red
    })
  }

  console.log({roleDef, roleName})
}

const init = (bot) => {
  BOT = bot

  BOT.register('!defineRole', defineRole)
}

module.exports = {
  init
}
