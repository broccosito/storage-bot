const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
const COLOR = process.env.COLOR
const fetch = require('node-fetch')

module.exports = class ShortenCommand extends BaseCommand {
  constructor() {
    super('shorten', 'links', []);
  }

  async run(client, message, args) {
    const serverURI = process.env.SERVER_URI
    const serverAuth = process.env.AUTHORIZATION

    var regex = /(https?:\/\/[^\s]+)/g;

    if(!args[0]) {
      const nolinklol = new Discord.MessageEmbed()
      .setAuthor('You did not provided a link!', client.user.avatarURL())
      .setColor(COLOR)
      return message.channel.send(nolinklol)
    }

    const checklink = await regex.test(args[0])

    if(checklink === false) {
      const novalidlink = new Discord.MessageEmbed()
      .setAuthor('The link that you provided is not valid!', client.user.avatarURL())
      .setColor(COLOR)
      return message.channel.send(novalidlink)
    }

    const shortened = new Discord.MessageEmbed()
    .setTitle('Done!')
    .setDescription(`Your link has been shortened successfully, You can find it below. \n`)
    .setColor(COLOR)

    const req = await fetch(encodeURI(serverURI), {
      method: 'POST',
      headers: {
        "shorten-url": args[0],
        "Authorization": serverAuth
      },
    }).then(message.channel.send(shortened))

    const res = await req.json()


  }
}