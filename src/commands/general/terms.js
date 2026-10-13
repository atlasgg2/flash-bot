const config = require('../../config');

module.exports = {
  name: 'terms',
  description: 'Shows the terms URL or summary.',
  usage: '!terms',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const terms = process.env.TERMS_URL || 'https://example.com/terms';
    return message.reply({ embeds: [{ title: 'Terms', description: `[Terms and conditions](${terms})`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
