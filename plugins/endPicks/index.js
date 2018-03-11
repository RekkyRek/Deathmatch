let BOT

const endPick = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }

  let toEnd = message.content.toLowerCase().split(' ')[1]
  if (toEnd === 'killer') {
    let killerPick = await BOT.database.getServerData('GLOBAL', 'running_pick')
    killerPick.ends = new Date()
    await BOT.database.setServerData('GLOBAL', 'running_pick', killerPick)
  } else if (toEnd === 'revive') {
    let revivePick = await BOT.database.getServerData('GLOBAL', 'running_revive_pick')
    revivePick.ends = new Date()
    await BOT.database.setServerData('GLOBAL', 'running_revive_pick', revivePick)
  } else {
    BOT.denied(message)
    return
  }

  BOT.success(message)
}

const init = (bot) => {
  BOT = bot

  BOT.register('!endPick', endPick)
}

module.exports = {
  init
}
