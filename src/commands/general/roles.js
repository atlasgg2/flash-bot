const config = require('../../config');

module.exports = {
  name: 'roles',
  description: 'Lists roles in the server.',
  usage: '!roles',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const guild = message.guild;
    if (!guild) return message.reply('This command only works in a server.');
    const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(r => `${r.name} (${r.members.size})`).slice(0, 20).join('\n');
    return message.reply({ embeds: [{ title: `${guild.name} roles`, description: roles || 'No roles found.', color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
