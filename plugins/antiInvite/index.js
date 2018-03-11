let BOT

const scanMessage = async (message) => {
  if (message.content.toLowerCase().indexOf('discord.gg') > -1) {
    let serverData = await BOT.database.getServerData(message.guild.id, 'invite_cache')
    if (serverData === undefined) { serverData = {} }

    let inviteLink = message.content.substr(message.content.toLowerCase().indexOf('discord.gg'))
    if (inviteLink.indexOf(' ') > -1) { inviteLink = inviteLink.substr(0, inviteLink.indexOf(' ')) }

    console.log(serverData[inviteLink])
    if (serverData[inviteLink] && serverData[inviteLink].valid === false) {
      message.delete()
      return
    }

    const invite = await BOT.client.fetchInvite(inviteLink)
    const guildID = invite.guild.id

    let guildData = await BOT.database.getServerData(message.guild.id, 'guild_whitelist')
    if (guildData === undefined) { guildData = { } }
    if (guildData[guildID] === undefined) { guildData[guildID] = { valid: false } }

    serverData[inviteLink] = { valid: guildData[guildID].valid }

    await BOT.database.setServerData(message.guild.id, 'invite_cache', serverData)
    if (!serverData[inviteLink].valid) {
      message.delete()
    }
  }
}

const setWhitelist = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }

  const args = message.content.toLowerCase().split(' ').slice(1)
  if (!args[0] || !args[1]) {
    BOT.send(message.channel, {
      title: 'Usage Error',
      description: `To whitelist a server, use \`!whitelistInvite <Guild ID> <true|false>\``,
      color: BOT.colors.red
    })
    return
  }

  let guildData = await BOT.database.getServerData(message.guild.id, 'guild_whitelist')
  if (guildData === undefined) { guildData = { } }
  guildData[args[0]] = { valid: args[1] === 'true' }

  await BOT.database.setServerData(message.guild.id, 'guild_whitelist', guildData)
  await BOT.database.setServerData(message.guild.id, 'invite_cache', {})
  BOT.success(message)
}

const init = (bot) => {
  BOT = bot

  BOT.register('!whitelistInvite', setWhitelist)
  BOT.on('FUNC_message', scanMessage)
}

module.exports = {
  init
}
