let BOT

const Discord = require('discord.js')
const moment = require('moment')

const checkPick = async () => {
  try {
    let pick = await BOT.database.getServerData('GLOBAL', 'running_pick')
    if (pick === undefined) { return }
    if (new Date(pick.ends) < new Date()) {
      endPick(pick)
    } else {
      // console.log(pick)
      let message = BOT.client.guilds.get(pick.guildID).channels.get(pick.channelID).messages.get(pick.messageID)
      // console.log('m1', message)
      if (message === undefined) {
        // console.log('gey')
        message = await BOT.client.guilds.get(pick.guildID).channels.get(pick.channelID).fetchMessage(pick.messageID)
      }
      // console.log('m', message)
      if (message === undefined) { return }
      let newEmbed = new Discord.RichEmbed(message.embeds[0])
      let dur = moment.duration(new Date(pick.ends) - new Date())
      newEmbed.setFooter(`${dur.hours()} hours and ${dur.minutes()} minutes remaining`)
      if (dur.minutes() === 0) {
        newEmbed.setFooter(`Less than a minute remaining`)
      }
      message.edit(newEmbed).catch(e => {})
    }
  } catch (e) {
    console.log(e)
  }
}

const endPick = async (pick) => {
  console.log(pick)
  let guild = BOT.client.guilds.get(pick.guildID)
  let message = guild.channels.get(pick.channelID).messages.get(pick.messageID)
  if (message === undefined) {
    message = await guild.channels.get(pick.channelID).fetchMessage(pick.messageID).catch(e => {})
  }
  if (message === undefined) {
    return
  }
  message.delete()

  let killerRole = await BOT.database.getServerData(pick.guildID, 'role_killer')
  if (killerRole === undefined) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `The killer role has not been defined. \`!defineRole killer <Role Name>\``,
      color: BOT.colors.red
    })
    return
  }

  let playerRole = await BOT.database.getServerData(pick.guildID, 'role_player')

  let deadRole = await BOT.database.getServerData(pick.guildID, 'role_dead')
  let killers = message.guild.roles.get(killerRole)
  if (killers) {
    killers.members.forEach(killer => {
      try {
        killer.addRole(deadRole)
        killer.removeRole(killerRole)
      } catch (e) {}
    })
  }

  let immunityRole = await BOT.database.getServerData(pick.guildID, 'role_immunity')
  let immunityMembers = message.guild.roles.get(immunityRole)
  if (immunityMembers) {
    await immunityMembers.members.forEach(async (immunity) => {
      try {
        immunity.removeRole(immunityRole)
      } catch (e) {}
    })
  }

  let raffle = []
  let entered = await BOT.database.getServerData('GLOBAL', 'running_pick_entered')
  entered.users[BOT.client.user.id] = { entered: false }

  console.log(entered.users)

  Object.keys(entered.users).forEach(key => {
    console.log(key)
    if (entered.users[key].entered) {
      raffle.push(key)
    }
  })

  console.log(raffle)
  // Shuffle Array for extra randomness
  for (let i = raffle.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [raffle[i], raffle[j]] = [raffle[j], raffle[i]]
  }

  if (raffle.length < pick.amountWinners) {
    BOT.send(BOT.client.guilds.get(pick.guildID).channels.get(pick.channelID), {
      title: 'Jeff',
      description: `Not enough users entered`,
      color: BOT.colors.red
    })
    return
  }

  console.log(raffle)
  let winners = []
  for (let i = 0; i < pick.amountWinners; i++) {
    let winner = raffle[Math.floor(Math.random() * raffle.length)]
    if (winners.indexOf(winner) > -1) { i-- } else {
      winners.push(winner)
    }
  }

  console.log('winners', winners)

  await winners.forEach(async (winner) => {
    try {
      console.log('winner', guild.members.get(winner).toString())
      let wuser = guild.members.get(winner)
      if (!wuser) { wuser = await guild.fetchMember(winner) }
      wuser.removeRole(playerRole)
      wuser.addRole(killerRole)
    } catch (e) { console.log(e) }
  })

  let winnerStr = `Winners:\n`
  winners.forEach(winner => {
    if (guild.members.get(winner)) {
      winnerStr += `${guild.members.get(winner).toString()}\n`
    }
  })

  BOT.client.guilds.get(pick.guildID).channels.get(pick.channelID).send(winnerStr)

  // let reactionUsers = message.reactions.get('🎉').users.array()
  // let winner = reactionUsers[Math.floor(Math.random() * reactionUsers.length)]
  // console.log(reactionUsers)
}

const init = (bot) => {
  BOT = bot

  BOT.on('FUNC_pulse', checkPick)
}

module.exports = {
  init
}
