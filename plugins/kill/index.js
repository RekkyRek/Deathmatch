let BOT

const kill = async (message) => {
  if (!message.guild) { return }
  let killerRole = await BOT.database.getServerData(message.guild.id, 'role_killer')
  let deadRole = await BOT.database.getServerData(message.guild.id, 'role_dead')
  let playerRole = await BOT.database.getServerData(message.guild.id, 'role_player')
  let immunityRole = await BOT.database.getServerData(message.guild.id, 'role_immunity')
  if (!killerRole || !deadRole || !playerRole) {
    return
  }

  let toKill = message.mentions.users.array()[0]
  if (!toKill) {
    BOT.send(message.author, {
      title: 'Kill Usage Error',
      description: `You need to mention someone in your kill command ya dumbom.`,
      color: BOT.colors.red
    })
    BOT.denied(message)
    return
  }
  toKill = await message.guild.members.get(toKill.id)

  let error

  if (message.member._roles.indexOf(killerRole) === -1) {
    error = `You're not a Murderer, are you?`
    BOT.send(message.author, {
      title: 'Kill Usage Error',
      description: error,
      color: BOT.colors.red
    })
    return
  }
  if (toKill._roles.indexOf(deadRole) > -1) {
    error = `${toKill.user.username}#${toKill.user.discriminator} is already dead.`
    BOT.send(message.author, {
      title: 'Kill Usage Error',
      description: error,
      color: BOT.colors.red
    })
    return
  }
  if (toKill._roles.indexOf(killerRole) > -1 || toKill._roles.indexOf(immunityRole) > -1) {
    error = `${toKill.user.username}#${toKill.user.discriminator} has kill immunity.`
    BOT.send(message.author, {
      title: 'Kill Usage Error',
      description: error,
      color: BOT.colors.red
    })
    return
  }
  if (toKill._roles.indexOf(playerRole) === -1) {
    error = `${toKill.user.username}#${toKill.user.discriminator} is not a player.`
    BOT.send(message.author, {
      title: 'Kill Usage Error',
      description: error,
      color: BOT.colors.red
    })
    return
  }

  toKill.setRoles([deadRole])
  message.member.setRoles([playerRole, immunityRole])

  BOT.send(message.author, {
    title: `Killed ${toKill.user.username}`,
    description: `You killed ${toKill.user.username}#${toKill.user.discriminator} 🔫\nYou've gained temporary immunity until the next draw is closed.`,
    color: BOT.colors.blue
  })

  BOT.send(toKill, {
    title: `You died.`,
    description: `${message.member.user.username}#${message.member.user.discriminator} killed you.\nDon't loose hope though, you can still be revived by entering the revival pick!`,
    color: BOT.colors.gray
  })

  BOT.success(message)
}

const init = (bot) => {
  BOT = bot

  BOT.register('!kill', kill)
}

module.exports = {
  init
}
