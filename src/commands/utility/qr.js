const config = require('../../config');

module.exports = {
  name: 'qr',
  description: 'Generate QR code for text or a URL (provider unavailable if library is not installed)',
  usage: '!qr <text/url>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Attach Files'] },
  async execute(message, args) {
    const text = args.join(' ');
    if (!text) return message.reply('Usage: !qr <text/url>');
    return message.reply({ embeds: [{ title: 'QR code unavailable', description: 'No QR generation library is configured for this host. You can still use the original text/url: ' + text, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
