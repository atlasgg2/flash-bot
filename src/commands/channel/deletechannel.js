const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'deletechannel',
  description: 'Delete a channel',
  usage: '!deletechannel [#channel]',
  aliases: ['delchannel'],
  hidden: false,
  permissions: { user: 'Manage Channels', bot: ['Manage Channels', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    if (!channel) return message.reply('Channel not found.');

    const perm = await permissionGuard.check(message, 'Manage Channels', ['Manage Channels']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      await channel.delete('Channel deleted by command');
      return message.reply({ content: `Deleted channel ${channel.name}` });
    } catch (err) {
      return message.reply('Failed to delete channel.');
    }
  }
};
