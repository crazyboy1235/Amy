// Users in this beta test
const enabledUsers = {
    '107890862679162880': 'Brian',
    '132525049977503744': 'Gideon',
    '578715287491182595': 'Leo',
    '371876953491505152': 'Max',
    '100385247287341056': 'Jeremiah',
    '257613641698902016': 'Kevin',
    '580246928596664321': 'Aedan',
    '756250474478305390': 'Leo'
};

const trackingGuild = '691848461217169438';
const updateChannel = '727649976766693416';
const debugChannel = '735272343773118504';

const leoMain = '578715287491182595';
const leoSecondary = '756250474478305390';

const log = require('log4js').getLogger('kevin');

// TODO:
// User has woken up
// User has gone back to sleep
// User has finally turned on their computer
// User is wanking (posting in sauce channel)
// Rate limit to an hour, and also check timezones

/**
 * Determine a presence change. Used for updating when
 * someone wakes up and such.
 * @param {Presence} oldPresence Old Presence data
 * @param {Presence} newPresence New Presence data
 */
module.exports = async (oldPresence, newPresence) => {
    if (!oldPresence) return;

    const guild = newPresence.guild;
    if (!(guild.available && guild.id == trackingGuild)) return;

    const snowflake = newPresence.userID;
    if (!(snowflake in enabledUsers)) return;
    const name = enabledUsers[snowflake];

    const client = newPresence.client;
    const channels = client.channels;

    const oldStatus = oldPresence.clientStatus;
    const newStatus = newPresence.clientStatus;
    const oldWebStatus = 'web' in oldStatus ? oldStatus['web'] : 'offline';
    const newWebStatus = 'web' in newStatus ? newStatus['web'] : 'offline';
    const oldMobileStatus = 'mobile' in oldStatus ? oldStatus['mobile'] : 'offline';
    const newMobileStatus = 'mobile' in newStatus ? newStatus['mobile'] : 'offline';
    const oldDesktopStatus = 'desktop' in oldStatus ? oldStatus['desktop'] : 'offline';
    const newDesktopStatus = 'desktop' in newStatus ? newStatus['desktop'] : 'offline';
    
    channels.fetch(debugChannel)
        .then((channel) => {
            // Anyone appears online on mobile
            if (oldMobileStatus == 'offline' && newMobileStatus != 'offline') {
                channel.send(`${name} has gone outside`);
            }

            // Leo's second account online
            else if (snowflake == leoSecondary && oldPresence.status == 'offline' && newPresence.status != 'offline') {
                channel.send('Leo is taking a dump');
            }
        })
        .catch(_ => { });
    
    channels.fetch(debugChannel)
        .then((channel) => {
            const emit = new Array();
            
            if (oldPresence.status != newPresence.status) {
                emit.push(`from ${oldPresence.status} to ${newPresence.status}`);
            }

            
            if (oldWebStatus != newWebStatus) {
                emit.push(`web status from ${oldWebStatus} to ${newWebStatus}`);
            }

            if (oldMobileStatus != newMobileStatus) {
                emit.push(`mobile status from ${oldMobileStatus} to ${newMobileStatus}`);
            }

            if (oldDesktopStatus != newDesktopStatus) {
                emit.push(`desktop status from ${oldDesktopStatus} to ${newDesktopStatus}`);
            }

            if (!emit.length) return;
            channel.send(name + ' changed ' + emit.join(' and '))
                .catch(_ => { });
        })
        .catch(_ => { });
}