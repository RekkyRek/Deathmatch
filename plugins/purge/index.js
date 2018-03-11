let BOT

const selectPurge = async (message) => {
  if (!message.guild) { return }
  if (await BOT.isOp(message) === false) { return }

  try {
    let hasPurged = false
    BOT.send(message.channel, {
      title: 'Select Purge',
      description: 'Select the message you want to purge until by reacting to it with :x: `:x:`\nThis function will timeout in 60 seconds.',
      color: BOT.colors.blue
    })
    const onReact = (reaction, user) => {
      console.log(reaction.emoji.toString(), user.id)
      if (user.id === message.author.id) {
        BOT.removeListener('FUNC_messageReactionAdd', onReact)

        reaction.message.channel.fetchMessages({after: reaction.message.id})
        .then(messages => {
          reaction.message.channel.bulkDelete(messages.array())
          reaction.message.delete()
          hasPurged = true
        })
      }
    }
    BOT.on('FUNC_messageReactionAdd', onReact)
    setTimeout(() => {
      if (!hasPurged) {
        BOT.send(message.channel, {
          title: 'Select Purge',
          description: `<@${message.author.id}> your purge has timed out.`,
          color: BOT.colors.red
        })
        BOT.removeListener('FUNC_messageReactionAdd', onReact)
      }
    }, 1000 * 60)
  } catch (e) {
    console.error(e)
    BOT.send(message.channel, {
      title: 'Error',
      description: e,
      color: BOT.colors.red
    })
  }
}

const init = (bot) => {
  BOT = bot

  BOT.register('!purge', selectPurge)
}

module.exports = {
  init
}
