const config = require('../../config');
const { isValidUrl } = require('../../utils/validators');

module.exports = {
  name: 'shorten',
  description: 'Safely validate a URL and return a stable fallback result or original URL',
  usage: '!shorten <url>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    const input = args[0];
    if (!input) return message.reply('Usage: !shorten <url>');
    if (!isValidUrl(input)) return message.reply('Provide a valid http:// or https:// URL.');
    return message.reply({ embeds: [{ title: 'Short URL', description: `Shortening is temporarily unavailable for this host. Original URL: ${input}`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
