// You are a sick person. This list was auto-generated, and I
// don't want to see it ever again.
const subreddits = [
    'hentai',
    'ecchi',
    'awwnime',
    'hentaimemes'
];

const { getRedditImage } = require('../lib/Internet');
const log = require('log4js').getLogger('amy');

/**
 * Undocumented command, returns a random NSFW image
 * @param {Client} client Discord server client
 * @param {Message} msg Command
 * @param {Array} args Arguments
 */
module.exports = async (client, msg, args) => {
    if (Math.random() < 0.85) {
        msg.channel.send('Yikes... this photo? You need help.');
        return;
    }
    if (msg.channel.type == 'text' && msg.channel.nsfw) {
        try {
            getRedditImage(function (data = 'Loading...') {
                msg.channel.send(data);
            }, subreddits);
        } catch (err) {
            log.error(`While trying to grab a Reddit NSFW picture I got ${err}`);
        }
    } else {
        msg.channel.send('NSFW images are only allowed in NSFW channels... you sick bastard.');
    }
}