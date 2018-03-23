let BOT

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
      if (error) throw new Error(error)
      resolve(JSON.parse(body))
    })
  })
}

const endPick = async (message) => {
  if (await BOT.isOp(message) === false) { return }
  let deadRole = message.guild.roles.get(await BOT.database.getServerData('421082803669827584', 'role_dead'))

  let leaderboard = await getLeaderboard()

  let raffle = []
  let entered = await deadRole.members.array()

  await entered.forEach(async key => {
    let user = leaderboard.find(function (u) {
      if (!u) { return false }
      return u.user_id === key.id
    })
    if (user.rank <= 200) {
      raffle.push(key.id)
    }
  })

  // Shuffle Array for extra randomness
  for (let i = raffle.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [raffle[i], raffle[j]] = [raffle[j], raffle[i]]
  }

  let winners = []
  for (let i = 0; i < 4; i++) {
    let winner = raffle[Math.floor(Math.random() * raffle.length)]
    if (winners.indexOf(winner) > -1) { i-- } else {
      winners.push(winner)
    }
  }

  console.log('winners', winners)

  message.channel.send(JSON.stringify(winners))

  BOT.success(message)

  // let reactionUsers = message.reactions.get('🎉').users.array()
  // let winner = reactionUsers[Math.floor(Math.random() * reactionUsers.length)]
  // console.log(reactionUsers)
}

const init = (bot) => {
  BOT = bot

  BOT.on('!devPick', endPick)
}

module.exports = {
  init
}
