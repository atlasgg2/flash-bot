const config = require('../../config');

module.exports = {
  name: 'membercount',
  description: 'Shows the total member count.',
  usage: '!membercount',
  aliases: ['members'],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const guild = message.guild;
    if (!guild) return message.reply('This command only works in a server.');
    return message.reply({ embeds: [{ title: 'Member count', description: `There are ${guild.memberCount} members in this server.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
