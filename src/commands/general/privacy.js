const config = require('../../config');

module.exports = {
  name: 'privacy',
  description: 'Shows the privacy guidance or link.',
  usage: '!privacy',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const privacy = process.env.PRIVACY_URL || 'https://example.com/privacy';
    return message.reply({ embeds: [{ title: 'Privacy', description: `[Privacy policy](${privacy})`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
