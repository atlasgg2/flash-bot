const config = require('../../config');

module.exports = {
  name: 'weather',
  description: 'Check a city weather forecast via public provider fallback',
  usage: '!weather <city>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Embed Links'] },
  async execute(message, args) {
    const city = args.join(' ');
    if (!city) return message.reply('Usage: !weather <city>');
    return message.reply({ embeds: [{ title: 'Weather', description: `Weather lookup for ${city} is temporarily unavailable. Recommended fallback: https://www.google.com/search?q=${encodeURIComponent(city + ' weather')}`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
