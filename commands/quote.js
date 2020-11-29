const colors = 0xFFFFFF;
const { quotes } = require('../config/fun.json');
const { MessageEmbed } = require('discord.js');

/**
 * Returns a random quote
 * @param {Client} client Discord server client
 * @param {Message} msg Command
 * @param {Array} args Arguments
 */
module.exports = async (client, msg, args) => {
    let index = Math.floor(Math.random() * quotes.length);
    const color = Math.floor(Math.random() * colors);
    const quote = new MessageEmbed()
        .setColor(color)
        .setFooter(`- ${quotes[index].author}`)
    if (args[1] && !isNaN(args[1])) {
        let idx = parseInt(args[1]) - 1;
        if (idx < quotes.length) {
            index = idx;
        } else {
            quote.addField('Error', `There are only ${quotes.length} quotes in the database, so a random one was used.`);
        }
    }
    quote.setDescription(`*${quotes[index].text}*`)
        .setTitle(`Random Quote #${index + 1}`);
    msg.channel.send(quote);
}