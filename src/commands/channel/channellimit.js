const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'channellimit',
  description: 'Set user limit for a voice channel',
  usage: '!channellimit <number> [#voice]',
  aliases: ['vlimit'],
  hidden: false,
  permissions: { user: 'Manage Channels', bot: ['Manage Channels', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const num = parseInt(args[0], 10);
    if (isNaN(num) || num < 0 || num > 99) return message.reply('Provide a valid limit (0-99).');
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel;
    if (!channel || channel.type !== 2) return message.reply('Target must be a voice channel.');

    const perm = await permissionGuard.check(message, 'Manage Channels', ['Manage Channels']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      await channel.setUserLimit(num);
      return message.reply({ content: `Set user limit to ${num} for ${channel.name}` });
    } catch (err) {
      return message.reply('Failed to set user limit.');
    }
  }
};
