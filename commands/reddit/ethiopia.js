const subreddit = 'ethiopiapics';

const { getRedditImage } = require('../../lib/Reddit');
const log = require('log4js').getLogger('amy');

/**
 * Returns a random photo from /r/EthiopiaPics
 * @param {Message} msg Command
 * @param {Array} args Arguments
 */
module.exports = async (msg, args) => {
    try {
        getRedditImage(function (data = 'Loading...') {
            msg.channel.send(data);
        }, subreddit);
    } catch (err) {
        log.error(`While trying to grab a Reddit /r/EthiopiaPics picture I got ${err}`);
    }
}