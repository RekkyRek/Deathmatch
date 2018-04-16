const emojiRegex = require('emoji-regex')
const regex = emojiRegex()

let BOT
let modOn = false

let lastMessages = {}

const handle = async (message) => {
  if (!message.guild) { return }
  if (message.author.id === BOT.client.user.id) { return }

  let maxEmojis = 100000000
  let minMsgTime = 100
  if (modOn) { maxEmojis = 4; minMsgTime = 1500 }

  if (lastMessages[message.author.id]) {
    if (new Date(message.createdTimestamp) - new Date(lastMessages[message.author.id]) < minMsgTime) {
      message.delete()
      return
    }
  }

  let match
  let matches = []
  while ((match = regex.exec(message.content))) {
    const emoji = match[0]
    matches.push(emoji)
  }

  if (matches && matches.length > maxEmojis) {
    message.delete()
    return
  }

  lastMessages[message.author.id] = message.createdTimestamp

  let emojisRaw = message.content.match(/<(.*?)>/g)
  if (emojisRaw && emojisRaw.length > maxEmojis) {
    message.delete()
  }
}

const init = (bot) => {
  BOT = bot

  BOT.register('!antispam', async (m) => {
    if (await BOT.isOp(m) === false) { return }
    modOn = !modOn
    BOT.success(m)
    BOT.send(m.channel, {
      title: 'AntiSpam',
      description: modOn ? `**AntiSpam has been turned on.**\nMax Emotes: 4\nMinimum Message Delay: 1500ms` : `**AntiSpam has been turned off.**\nMax Emotes: Unlimited\nMinimum Message Delay: 100ms`,
      color: BOT.colors.blue
    })
  })
  BOT.on('FUNC_message', handle)
}

module.exports = {
  init
}
