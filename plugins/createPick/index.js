let BOT
let entered
let pick

const createPick = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }

  const homeID = await BOT.database.getServerData(message.guild.id, 'home')
  console.log(homeID)
  if (homeID === undefined) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `Please set a home channel first using \`!setHome\``,
      color: BOT.colors.red
    })
    return
  }

  let amountWinners = parseInt(message.content.split(' ')[1])
  if (!amountWinners) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `Usage: \`!createPick <Amount of Winners> <Title>\``,
      color: BOT.colors.red
    })
    return
  }

  let title = message.content.split(' ').slice(2).join(' ')
  if (!title || title.length < 2) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `Usage: \`!createPick <Amount of Winners> <Title>\``,
      color: BOT.colors.red
    })
    return
  }

  let deadRole = await BOT.database.getServerData(pick.guildID, 'role_dead')
  let killerRole = await BOT.database.getServerData(pick.guildID, 'role_killer')
  /*let killers = message.guild.roles.get(killerRole)
  if (killers) {
    killers.members.forEach(killer => {
      killer.setRoles([deadRole])
    })
  }*/

  let playerRole = await BOT.database.getServerData(pick.guildID, 'role_player')
  let immunityRole = await BOT.database.getServerData(pick.guildID, 'role_immunity')
  /*let immunityMembers = message.guild.roles.get(immunityRole)
  if (immunityMembers) {
    immunityMembers.members.forEach(immunity => {
      immunity.setRoles([playerRole])
    })
  }*/

  let pickMsg = await BOT.send(message.guild.channels.get(homeID), {
    title: title,
    description: `${amountWinners} winners. React to enter`,
    footer: {text: '24 hours and 0 minutes remaining'},
    color: BOT.colors.blue
  })

  pickMsg.react('🎉')

  const minutes = 60 * 24
  const ends = new Date(new Date(Date.now()).getTime() + minutes * 60000)

  pick = { guildID: message.guild.id, channelID: homeID, messageID: pickMsg.id, amountWinners, ends }
  entered = { users: { } }

  await BOT.database.setServerData('GLOBAL', 'running_pick', pick)
  await BOT.database.setServerData('GLOBAL', 'running_pick_entered', { users: { } })
  // console.log(reactionMsg)
}

const onReactAdd = async (reaction, user) => {
  if (reaction.message.id !== pick.messageID) { return }

  entered.users[user.id] = { entered: true }
  console.log(entered)
  await BOT.database.setServerData('GLOBAL', 'running_pick_entered', entered)
}

const onReactRemove = async (reaction, user) => {
  if (reaction.message.id !== pick.messageID) { return }

  entered[user.id] = { entered: false }
  console.log(entered)
  await BOT.database.setServerData('GLOBAL', 'running_pick_entered', entered)
}

const roll = async (msg) => {
  if (await BOT.isOp(msg) === false) { return }
  let playerRole = await BOT.database.getServerData(msg.guild.id, 'role_player')
  let killerRole = await BOT.database.getServerData(msg.guild.id, 'role_killer')
  let players = msg.guild.roles.get(playerRole)
  let i = 0;
  if (players) {
    players.members.forEach(player => { try { if(i < 50) { player.setRoles([killerRole]); i++; } } catch(e) {console.log(e)}})
  }
}

const init = (bot) => {
  BOT = bot

  BOT.on('FUNC_dbReady', () => {
    BOT.database.getServerData('GLOBAL', 'running_pick_entered')
      .then((data) => {
        entered = data
        if (entered === undefined) { entered = { users: { } } }
      })
    BOT.database.getServerData('GLOBAL', 'running_pick')
      .then((data) => {
        pick = data
        if (pick === undefined) { pick = {guildID: 'null', channelID: 'null', messageID: 'null', ends: new Date()} }
      })
  })

  BOT.register('!createPick', createPick)
  BOT.register('!repick', roll)
  BOT.on('FUNC_messageReactionAdd', onReactAdd)
  BOT.on('FUNC_messageReactionRemove', onReactRemove)
}

module.exports = {
  init
}
