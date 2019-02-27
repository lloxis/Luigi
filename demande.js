const Discord = require("discord.js")
const Index = require("./index.js")



module.exports.run = async (messageText, emojis, message) => {
    if (typeof messageText !== 'string') throw new SyntaxError('messageText invald')
    let messageDemande = await message.channel.send(messageText)
    emojis.forEach(async emoji => {
        await messageDemande.react(emoji)
    });

    const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id
    return messageDemande.awaitReactions(filter, {
        max: 1,
        time: 15000,
        errors: ['time']
    }).then(collected => {
        messageDemande.delete()
        return collected.first().emoji.name
    }).catch(() =>{
        messageDemande.delete()
        return 'TimeOut'
    });
}