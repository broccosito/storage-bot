const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
const COLOR = process.env.COLOR
const fetch = require('node-fetch')
const request = require('request')
const fs = require('fs')
const FormData = require('form-data');     
var form = new FormData();
module.exports = class UploadCommand extends BaseCommand {
  constructor() {
    super('upload', 'files', []);
  }

  run(client, message, args) {
    const serverURI = process.env.SERVER_URI
    const serverAuth = process.env.AUTHORIZATION

    if(!serverAuth) {
      const missingAuth = new Discord.MessageEmbed()
      .setTitle("Authorization")
      .setDescription("The `AUTHORIZATION` Field is not set in the `.env` file. Please set it and try again.")
      .setColor(COLOR)
      return message.channel.send(missingAuth)
    }

    if(!serverURI) {
      const missingAuth = new Discord.MessageEmbed()
      .setTitle("Authorization")
      .setDescription("The `SERVER_URI` Field is not set in the `.env` file. Please set it and try again.")
      .setColor(COLOR)
      return message.channel.send(missingAuth)
    }

    form = new FormData();

    const question1 = new Discord.MessageEmbed()
    .setAuthor('Please upload the file.', client.user.avatarURL())
    .setColor(COLOR)
    message.channel.send(question1)

    const filter = m => {
      return m.author.id === message.author.id
    }

    const collector1 = message.channel.createMessageCollector(filter)

    collector1.on('collect', async(m1) => {
      collector1.stop()

      if(m1.attachments.array()[0] === undefined) {
        const nofiles = new Discord.MessageEmbed()
        .setAuthor('You did not uploaded a valid file!', client.user.avatarURL())
        .setColor(COLOR)
        return message.channel.send(nofiles)
      }

      const filelol = m1.attachments.array()[0]
      
      var options = {
        url: filelol.url,
        method: "get",
        encoding: null
    };

    request(options, async function(error, response, body1) {
    form.append('files', body1, { filename: filelol.name });
    const options = {
      method: 'POST',
      body: form,
      headers: {
        "Authorization": process.env.AUTHORIZATION
      }
    };

    const uploadinggg = new Discord.MessageEmbed()
    .setAuthor('Uploading... ', client.user.avatarURL())
    .setColor(COLOR)
    .setDescription(`We are uploading ${filelol.name}, Please wait...`)
    const uplaodembeddd = await message.channel.send(uploadinggg)


    const requestyes = await fetch(encodeURI(serverURI), options)

    const responseyes = await requestyes.json()

    console.log(responseyes)

    const yesdaddyuploaded = new Discord.MessageEmbed()
    .setAuthor('Done!', client.user.avatarURL())
    .setColor(COLOR)
    .setDescription(`Your files have been successfully uploaded! You can find the link below. \n**${responseyes.url}**`)
    uplaodembeddd.edit(yesdaddyuploaded)

    console.log(`Successfully uploaded ${filelol.name} with the url ${responseyes.url}`)

    form = null
 });
    })
  }
}