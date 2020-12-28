const colors = 0xFFFFFF;
const perPage = 7;

const { commands } = require('../config/commands.json');
const { MessageEmbed } = require('discord.js');

/**
 * List the commands avilable on the bot
 * @param {Message} msg Message to act
 * @param {Array} args Arguments
 */
module.exports = async (msg, args) => {
    var page = 1;
    var start = 0;
    if (args.length > 1 && !isNaN(args[1])) {
        let value = parseInt(args[1]);
        let begin = (value - 1) * perPage;
        if (begin < commands.length && value > 0) {
            page = value;
            start = begin;
        }
    }
    let description = '';
    let embed = new MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname : msg.client.user.username, msg.author.displayAvatarURL())
        .setColor(Math.floor(Math.random() * colors))
        .setFooter(`Page ${page} of ${Math.ceil(commands.length / perPage)}`);
    let end = start + perPage;
    for (var i = start; i < (end > commands.length ? commands.length : end); i++) {
        description += `**${commands[i].command}**: ${commands[i].description}\n`
    }
    embed.setDescription(description);
    msg.channel.send(embed);
}