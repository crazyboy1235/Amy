const loading = '<a:loading:788925074052612121>';
const left = '<a:goright:788932776908947466>';
const right = '<a:goleft:788932776875130880>';
const good = ['<a:partycorgi:788925997344358441>'];
const normal = ['🪙', '🎁', '🧧', '✨'];
const bad = ['<a:amongusparty:788925073498177546>', '🪵', '🌿'];
const minimum = 1;
const rolls = 5;
const lowerOdds = 0.4;
const upperOdds = 0.9;
const colors = 0xFFFFFF;
const warnings = [
    '40% of gambling addicts have an anxiety disorder.',
    '50% of gambling addicts have a mood disorder.',
    '60% of gambling addicts have a personality disorder.',
    'Gamble safe and responsibly.',
    'When the fun stops, STOP.',
    'Call 1-800-GAMBLER to get help with a gambling addiction.',
    'Text SUPPORT to 53342 to get help with a gambling addiction.',
    'Your chances of a jackpot are 1 in 100,000.',
    'You must be 18 to gamble in California.',
    'Invest your college tuition into gambling.',
    'If you can gamble for free, it is actually a contest.'
];
const invalidBet = "You didn't provide a valid bet, so we've automatically used $5.";

const { currency } = require('../../config/economy.json');

const { MessageEmbed } = require('discord.js');
const { updateBalance, getBalance } = require('../../lib/Member');
const log = require('log4js').getLogger('amy');

var users = new Set();

/**
 * Play the slots machine
 * @param {Message} msg Command
 * @param {Array} args Arguments
 */
module.exports = async (msg, args) => {
    const channel = msg.channel;
    const debug = false; // Reimplement debug function one day
    const user = msg.author;
    if (users.has(user)) {
        return channel.send('You cannot start another slots while you are already playing one!');
    } else {
        users.add(user);
    }
    let bet = 5;
    if (args.length > 1) {
        bet = parseInt(args[1]);
    } else {
        channel.send(invalidBet);
    }
    if (!bet || bet < minimum) {
        channel.send(`The minimum bet is ${currency}${minimum}. Try again!`);
        return;
    }
    if (!debug) {
        await getBalance(msg.author.id, function (data) {
            if (bet > data) {
                channel.send("You don't have enough money for this!");
            } else {
                main(msg, user, bet, debug);
            }
        });
    } else {
        await main(msg, user, bet, debug);
    }
}

/**
 * Main routine
 * @param {Message} msg Message
 * @param {Number} bet Amount bet
 * @param {Boolean} debug Whether or not to debug
 */
async function main(msg, user, bet, debug) {
    const channel = msg.channel;
    let [current, values] = generateSlots();
    channel.send(generateSlotString(current))
        .then(msg => {
            for (let i = 1; i <= rolls; i++) {
                setTimeout(() => {
                    [current, values] = generateSlots(current, values);
                    msg.edit(generateSlotString(current));
                    if (i == rolls) {
                        [modifier, spoiler] = calculateValue(current, values);
                        const winnings = modifier > 0 ? Math.floor(modifier * bet) : 0;
                        const losses = bet + (modifier < 0 ? Math.abs(Math.floor(modifier * bet)) : 0);
                        const embed = new MessageEmbed()
                            .addField('Winnings', `${currency}${winnings}`, true)
                            .addField('Losses', `${currency}${losses}`, true)
                            .setColor(Math.floor(Math.random() * colors))
                            .setDescription(spoiler)
                            .setFooter(warnings[Math.floor(Math.random() * warnings.length)])
                            .setTitle('🥳 You are a winner! 🥳');
                        msg.edit(embed);
                        if (!debug) {
                            const change = winnings - losses;
                            log.info(`Slots ran normally, and ${user.tag}'s balance is changing by ${change}`);
                            updateBalance(user.id, change);
                        }
                        users.delete(user);
                    }
                }, i * 500);
            }
        });
}

/**
 * Generates a slot string
 * @param {Array} current Current slots
 * @returns {String} Slots string
 */
function generateSlotString(current) {
    return `${left} ${current.join(' ')} ${right}`;
}

/**
 * Generates a slots
 * @param {Array} current Current array of rolls
 * @returns {Array} New array of rolls
 */
function generateSlots(current = [], values = Array.from({ length: rolls }).fill(0)) {
    if (current.length) {
        const idx = current.indexOf(loading);
        if (idx == -1) {
            return [current, values];
        } else {
            const rand = Math.random();
            let pick;
            if (rand < lowerOdds) {
                pick = bad[Math.floor(Math.random() * bad.length)];
                values[idx] = -1.5;
            } else if (rand < upperOdds) {
                pick = normal[Math.floor(Math.random() * normal.length)];
                values[idx] = 1;
            } else {
                pick = good[Math.floor(Math.random() * good.length)];
                values[idx] = 2;
            }
            current[idx] = pick;
            return [current, values];
        }
    } else {
        return [Array.from({
            length: rolls
        }).fill(loading), values];
    }
};

/**
 * Determines the slots values
 * @param {Array} current The slots values
 * @param {Array} values Values of the function
 * @returns {Array} [Winnings, spoiler string]
 */
function calculateValue(current, values) {
    const slotSet = new Set(current);
    const score = values.reduce(function (acc, curr) {
        return acc + curr
    });
    let modifier = 1;
    let spoiler = '';
    if (slotSet.size > 1) {
        modifier += (rolls - slotSet.size) / rolls;
        spoiler += `You got a ${rolls - slotSet.size}x kind modifier bonus! `;
    } else {
        modifier = 2;
        spoiler += 'FIVE of a kind!? You need some insane luck for that. '
    }
    if (score == rolls * 2) {
        modifier *= 2;
        spoiler += 'JACKPOT! This is the best you could have done.';
    } else if (score > (rolls + 1)) {
        modifier *= 1.5;
    } else if (score > rolls) {
        modifier *= 1.1
    } else if (score < 0) {
        modifier = 0;
        spoiler += 'This one was a bit unlucky. Try again? ';
        if (slotSet.size == 1) {
            modifier *= -1;
            spoiler += 'No denying it, this was the unluckiest roll.'
        }
    }
    return [modifier, spoiler];
}