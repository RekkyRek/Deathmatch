let BOT

const reset = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }
  if (message.author.id !== '215143736114544640') { BOT.denied(message); return }

  let pick = await BOT.database.getServerData('GLOBAL', 'running_pick')
  let revivePick = await BOT.database.getServerData('GLOBAL', 'running_revive_pick')

  let guild = BOT.client.guilds.get(pick.guildID)

  let nsfwRole = await BOT.database.getServerData(message.guild.id, 'role_nsfw')

  try {
    let pickMsg = await guild.channels.get(pick.channelID).fetchMessage(pick.messageID)
    pickMsg.delete()

    let revivePickMsg = await guild.channels.get(revivePick.channelID).fetchMessage(revivePick.messageID)
    revivePickMsg.delete()
  } catch (e) {

  }

  let killerRole = await BOT.database.getServerData(pick.guildID, 'role_killer')
  let killers = message.guild.roles.get(killerRole)
  if (killers) {
    killers.members.forEach(killer => {
      console.log('killer')
      killer.removeRole(killerRole)
    })
  }

  let deadRole = await BOT.database.getServerData(pick.guildID, 'role_dead')
  let playerRole = await BOT.database.getServerData(pick.guildID, 'role_player')

  let deadPlayers = message.guild.roles.get(deadRole)
  if (deadPlayers) {
    deadPlayers.members.forEach(dead => {
      console.log('dead')
      dead.setRoles(dead.roles.get(nsfwRole) ? [playerRole, nsfwRole] : [playerRole])
    })
  }

  await BOT.database.setServerData('GLOBAL', 'running_pick', {guildID: 'null', channelID: 'null', messageID: 'null', ends: new Date(new Date(Date.now()).getTime() + 365 * 24 * 60 * 60000)})
  await BOT.database.setServerData('GLOBAL', 'running_revive_pick', {guildID: 'null', channelID: 'null', messageID: 'null', ends: new Date(new Date(Date.now()).getTime() + 365 * 24 * 60 * 60000)})

  await BOT.database.setServerData('GLOBAL', 'running_pick_entered', { users: { } })
  await BOT.database.setServerData('GLOBAL', 'running_revive_pick_entered', { users: { } })

  BOT.success(message)
}

const init = (bot) => {
  BOT = bot

  BOT.register('!reset', reset)
}

module.exports = {
  init
}
