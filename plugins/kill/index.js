let BOT

const kill = async (message) => {
  if (!message.guild) { return }
  let killerRole = await BOT.database.getServerData(message.guild.id, 'role_killer')
  let deadRole = await BOT.database.getServerData(message.guild.id, 'role_dead')
  let playerRole = await BOT.database.getServerData(message.guild.id, 'role_player')
  if (!killerRole || !deadRole || !playerRole) {
    return
  }

  let toKill = message.mentions.users.array()[0]
  if (!toKill) {
    BOT.send(message.author, {
      title: 'Usage Error',
      description: `You need to mention someone in your kill command ya dumbom.`,
      color: BOT.colors.red
    })
    BOT.denied(message)
    return
  }
  toKill = await message.guild.members.get(toKill.id)

  let error

  if (toKill._roles.indexOf(deadRole) > -1) {
    error = `${toKill.user.username}#${toKill.user.discriminator} is already dead.`
  }
  if (toKill._roles.indexOf(killerRole) > -1) {
    error = `${toKill.user.username}#${toKill.user.discriminator} has kill immunity.`
  }
  if (toKill._roles.indexOf(playerRole) === -1) {
    error = `${toKill.user.username}#${toKill.user.discriminator} is not a player.`
  }
  if (message.member._roles.indexOf(killerRole) === -1) {
    error = `You're ded lol.`
  }
  if (error) {
    BOT.send(message.author, {
      title: 'Usage Error',
      description: error,
      color: BOT.colors.red
    })
    return
  }

  message.member.removeRole(killerRole)
  toKill.addRole(deadRole)
  toKill.removeRole(playerRole)
  BOT.success(message)
}

const init = (bot) => {
  BOT = bot

  BOT.register('!kill', kill)
}

module.exports = {
  init
}
