const config = require('../../config');

module.exports = {
  name: 'changelog',
  description: 'Shows the latest changelog entry.',
  usage: '!changelog',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    return message.reply({ embeds: [{ title: 'Changelog', description: 'Initial Flash foundation release. More modules and commands will be added in batches.', color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
