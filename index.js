const Discord = require('discord.js')
const bot = new Discord.Client()
const prefix = process.env.PREFIX
const Demande = require("./demande.js")



bot.login(process.env.TOKEN)




bot.on('ready', function () {
    console.log("bot is ready !")
    bot.user.setActivity('Créé par lloxis', {"type": "WATCHING"})
})

function tirageAuSort(participants, guild, nbDeGagnants) {
    if (!participants || participants.length <= 0) throw new SyntaxError('participants invald')
    if (typeof nbDeGagnants !== 'number' || nbDeGagnants < 1) throw new SyntaxError('nbDeGagnants invald')
    if (!guild || !guild.members && guild !== 'non') throw new SyntaxError('guild invald')


    let particip = participants
    let gagnants = []
    let gagnantIndex
    for (i = nbDeGagnants; i > 0; i--) {
        let whileIsOn = true
        while (whileIsOn === true) {
            gagnantIndex = Math.floor(Math.random() * particip.length)
            gagnant = particip[gagnantIndex]
            if (guild !== 'non' && guild.members.array().includes(gagnant) === false) {
                particip.splice(gagnantIndex, 1)
                if (particip.length <= 0 || particip.length === undefined) {
                    whileIsOn = false
                    i = 0
                }
            } else {
                whileIsOn = false
                gagnants.push(gagnant)
                particip.splice(gagnantIndex, 1)
                if (particip.length <= 0 || particip.length === undefined) {
                    i = 0
                }
            }
        }
    }
    return gagnants
}




bot.on('message', function (message) {
    if (message.content.startsWith(prefix) === false) return
    if (message.author.bot === true) return
    if (message.member.hasPermission('ADMINISTRATOR') === false) return

    let messageWithoutPrefix = message.content.slice(prefix.length)


    if (messageWithoutPrefix.startsWith('tirage')) {
        let messageArray = messageWithoutPrefix.split(" ")
        let messageFirstWord = messageArray[0]
        let type = messageFirstWord.slice(6)
        let args = messageArray.slice(1)


        if (!type) {
            let nbDeGagnants
            if (args.length <= 0) nbDeGagnants = 1
            else {
                let firstArgNumber = parseInt(args[0])
                if (isNaN(firstArgNumber) === true && firstArgNumber < 1) {
                    message.channel.send('Le premier argument de la commande tirage est le nombre de gagnants à tirer au sort. Il doit être un entier >= à 1')
                    return
                }
                nbDeGagnants = firstArgNumber
            }

            let participants = message.guild.members.array().filter(function (member) { return member.user.bot === false })
            let nbDeParticipants = participants.length
            let gagnants
            if (nbDeParticipants <= 0 || !participants) {
                message.channel.send('Erreur lors du tirage, aucun membre trouvé')
                return
            }
            if (nbDeParticipants <= nbDeGagnants) {
                message.channel.send('Ils n\'y a pas assez de membres pour tirer ce nombre de gagnants\n(' + nbDeParticipants + ' participants trouvés)')
                return
            }
            try {
                gagnants = tirageAuSort(participants, 'non', nbDeGagnants)
                console.log(nbDeGagnants)
                if (nbDeGagnants === 1) {
                    if (gagnants.length <= 0 || gagnants.length === undefined) message.channel.send('Aucun membre valide trouvé. Si ce problème persiste contacter moi par mail : chtilouis782@gmail.com')
                    else message.channel.send('<@' + gagnants[0].id + '> a était tiré au sort parmi ' + nbDeParticipants + ' membres')
                } else {
                    async function test() {
                        let DemandeResult = await Demande.run('Voulez vous classer les tirés au sort ?', ['👍','👎'], message)
                        switch(DemandeResult) {
                            case '👍':
                                let messageToSend = ['Les tirés au sort sont :']
                                gagnants.forEach((gagnant, index) => {
                                    messageToSend.push(index + 1  + ' : ' + gagnant)
                                })
                                message.channel.send(messageToSend.join('\n') + '\nIls ont étaient tirés au sort parmi ' + nbDeParticipants + ' membres')
                                break
                            case '👎':
                                message.channel.send(gagnants.join(' , ') + ' ont étaient tirés au sort parmi ' + nbDeParticipants + ' membres')
                                break
                            case 'TimeOut':
                                message.channel.send('Tirage annulé')
                                break
                        }
                    }
                    test()
                }
            } catch (error) {
                console.log('Erreur lors du tirage')
                console.log(error.message)
                message.channel.send('Une erreur c\'est produite lors du tirage. Si ce problème persiste contacter moi par mail : chtilouis782@gmail.com')
            }
        } else {
            message.channel.send('type')
        }
    }



})
