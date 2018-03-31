let BOT

const Discord = require('discord.js')
const moment = require('moment')
const request = require('request')

const getLeaderboard = async () => {
  return new Promise((resolve, reject) => {
    var jar = request.jar()
    jar.setCookie(request.cookie('__cfduid=d498707740b9b2095ed6c8388aa69817e1521733736'), 'https://api.tatsumaki.xyz/guilds/421082803669827584/leaderboard')

    var options = {
      method: 'GET',
      url: 'https://api.tatsumaki.xyz/guilds/421082803669827584/leaderboard',
      headers: { authorization: '1fba6ca10aba9f03899c250e3e803143-35dc883356a4d1-494708f026b56aa957d1924fab7c7dae' },
      jar: 'JAR'
    }

    request(options, function (error, response, body) {
      if (error) resolve({error})
      try { resolve(JSON.parse(body)) } catch (e) { resolve({error: e}) }
    })
  })
}

const checkPick = async () => {
  try {
    let pick = await BOT.database.getServerData('GLOBAL', 'running_revive_pick')
    if (pick === undefined) { return }
    if (new Date(pick.ends) < new Date()) {
      endPick(pick)
    } else {
      let message = BOT.client.guilds.get(pick.guildID).channels.get(pick.channelID).messages.get(pick.messageID)
      if (message === undefined) {
        message = await BOT.client.guilds.get(pick.guildID).channels.get(pick.channelID).fetchMessage(pick.messageID)
      }
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
  let guild = BOT.client.guilds.get(pick.guildID)
  let message = guild.channels.get(pick.channelID).messages.get(pick.messageID)
  if (message === undefined) {
    message = await guild.channels.get(pick.channelID).fetchMessage(pick.messageID).catch(e => {})
  }
  if (message === undefined) {
    return
  }
  message.delete()

  let deadRole = await BOT.database.getServerData(pick.guildID, 'role_dead')
  if (deadRole === undefined) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `The killer role has not been defined. \`!defineRole dead <Role Name>\``,
      color: BOT.colors.red
    })
    return
  }

  let raffle = []
  let entered = await BOT.database.getServerData('GLOBAL', 'running_revive_pick_entered')
  entered.users[BOT.client.user.id] = { entered: false }

  console.log(entered.users)

  let leaderboard = await getLeaderboard()
  if (!leaderboard.error) {
    Object.keys(entered.users).forEach(key => {
      try {
        let user = leaderboard.find(function (u) {
          if (!u || u === null) { return false }
          return u.user_id === key.id
        })
        if (user && entered.users[key].entered && user.rank <= 200) {
          raffle.push(key)
        }
      } catch (e) {
        raffle.push(key)
      }
    })
  } else {
    Object.keys(entered.users).forEach(key => {
      raffle.push(key)
    })
  }

  if (raffle.length < pick.amountWinners) {
    Object.keys(entered.users).forEach(key => {
      raffle.push(key)
    })
  }

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

  let winners = []
  for (let i = 0; i < pick.amountWinners; i++) {
    let winner = raffle[Math.floor(Math.random() * raffle.length)]
    if (winners.indexOf(winner) > -1) { i-- } else {
      winners.push(winner)
    }
  }

  console.log('winners', winners)

  let playerRole = await BOT.database.getServerData(pick.guildID, 'role_player')
  await winners.forEach(async (winner) => {
    try {
      console.log('winner', guild.members.get(winner).toString())
      let wuser = guild.members.get(winner)
      if (!wuser) { wuser = await guild.fetchMember(winner) }
      wuser.addRole(playerRole)
      wuser.removeRole(deadRole)
    } catch (e) { console.log(e) }
  })

  let winnerStr = `Winners:\n`
  winners.forEach(winner => {
    if (guild.members.get(winner)) {
      winnerStr += `${guild.members.get(winner).toString()}\n`
      try {
        BOT.send(guild.members.get(winner), {
          title: 'You have been revived!',
          description: 'Now get back on the feild and start killing some people!',
          color: BOT.color.blue
        })
      } catch (e) {
        console.log(e)
      }
    }
  })

  BOT.client.guilds.get(pick.guildID).channels.get(pick.channelID).send(winnerStr)
}

const init = (bot) => {
  BOT = bot

  BOT.on('FUNC_pulse', checkPick)
}

module.exports = {
  init
}
