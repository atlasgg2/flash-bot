const config = require('../../config');

module.exports = {
  name: 'support',
  description: 'Shows the support URL.',
  usage: '!support',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const support = process.env.SUPPORT_URL || 'https://example.com/support';
    return message.reply({ embeds: [{ title: 'Support', description: `[Support link](${support})`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
