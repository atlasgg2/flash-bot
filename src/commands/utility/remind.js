const config = require('../../config');
const { parseDurationString } = require('../../utils/validators');
const db = require('../../database/database');

module.exports = {
  name: 'remind',
  description: 'Set a persistent reminder',
  usage: '!remind <time> <text>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Embed Links'] },
  async execute(message, args) {
    const timeArg = args[0];
    const text = args.slice(1).join(' ');
    if (!timeArg || !text) return message.reply('Usage: !remind <time> <text>');
    const ms = parseDurationString(timeArg);
    if (!ms) return message.reply('Unsupported duration. Try values like 10s, 5m, 2h, 1d.');
    const dueAt = Date.now() + ms;
    const reminder = db.addReminder(message.guild ? message.guild.id : 'dm', message.author.id, text, dueAt);
    return message.reply({ embeds: [{ title: 'Reminder set', description: `I will remind you <t:${Math.floor(dueAt / 1000)}:R> about: ${text}`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
