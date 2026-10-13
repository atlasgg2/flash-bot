const config = require('../../config');

module.exports = {
  name: 'credits',
  description: 'Shows credit information for the bot.',
  usage: '!credits',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    return message.reply({ embeds: [{ title: 'Credits', description: 'Flash by HeavenCloud India. Built with Discord.js and SQLite.', color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
