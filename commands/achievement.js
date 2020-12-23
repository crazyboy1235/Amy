const { getAchievement } = require('../lib/Achievement');

/**
 * Look at an achievement
 * @param {Client} client Discord server client
 * @param {Message} msg Command
 * @param {Array} args Arguments
 */
module.exports = async (client, msg, args) => {
    if (args.length < 2) {
        msg.channel.send('You need to provide me with an achievement!');
        return;
    }
    const data = getAchievement(args[1]);
    if (data) {
        const embed = {
            embed:
            {
                title: data.name,
                description: data.description,
                color: 14366683,
                thumbnail: {
                    url: `https://amyhelps.ml/images/achievements/${data.id}.png`
                }
            },
        };
        msg.channel.send(embed);
    } else {
        msg.reply(`That's not exactly an achievement...`);
    }
}