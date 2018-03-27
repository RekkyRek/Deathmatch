let BOT

const Discord = require('discord.js')
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
      try { resolve(JSON.parse(body)) } catch(e) { resolve({error: e}) }
    })
  })
}

const endPick = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }

  let minScore = message.content.split(' ')[1]

  if (!minScore) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `Usage \`!scorePrune <Minimum Score>\``,
      color: BOT.colors.red
    })
    return
  }

  let deadRole = await BOT.database.getServerData(message.guild.id, 'role_dead')
  if (deadRole === undefined) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `The killer role has not been defined. \`!defineRole dead <Role Name>\``,
      color: BOT.colors.red
    })
    return
  }

  let playerRole = await BOT.database.getServerData(message.guild.id, 'role_player')
  let roleData = message.guild.roles.get(playerRole)

  let leaderboard = await getLeaderboard()
  let userscores = {}
  if (!leaderboard.error) {
    leaderboard.forEach(key => {
      if(key) {
        userscores[key.user_id] = key.score
      }
    })
  } else {
    return
  }

  let members = await message.guild.fetchMembers()

  console.log(members.members)

  let test = []

  members.members.forEach(member => {
    if (member.roles.get(playerRole)) {
      if (userscores[member.id] && userscores[member.id] <= minScore) {
        test.push(member.id, userscores[member.id])
      }
    }
  })

  console.log(Array.from(members.members).length, test.length)
}

const init = (bot) => {
  BOT = bot

  BOT.on('!scorePrune', endPick)
}

module.exports = {
  init
}
