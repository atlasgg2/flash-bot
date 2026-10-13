const config = require('../../config');

module.exports = {
  name: 'time',
  description: 'Show current UTC time and local timezone summary',
  usage: '!time [location]',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Embed Links'] },
  async execute(message, args) {
    const now = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const stamp = Math.floor(now.getTime() / 1000);
    return message.reply({ embeds: [{ title: 'Current time', description: `UTC: <t:${stamp}:F>\nTime zone: ${tz}`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
