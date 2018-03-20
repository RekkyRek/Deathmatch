let BOT

const handleMessage = async (message) => {
  if (!message.guild) { BOT.denied(message); return }
  if (message.content.split(' ')[1] === 'dead' && message.content.split(' ')[2] === 'inside') { BOT.success(message); return }
  if (message.content.split(' ')[1] !== 'nsfw') { BOT.denied(message); return }
  let nsfwRole = await BOT.database.getServerData(message.guild.id, 'role_nsfw')

  if(message.member.roles.get(nsfwRole)) {
    message.member.removeRole(nsfwRole)
  } else {
    message.member.addRole(nsfwRole)
  }
  BOT.success(message)
}

const init = (bot) => {
  BOT = bot

  BOT.register('!iam', handleMessage)
}

module.exports = {
  init
}
