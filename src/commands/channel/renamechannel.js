const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'renamechannel',
  description: 'Rename a channel',
  usage: '!renamechannel <name> [#channel]',
  aliases: ['rname'],
  hidden: false,
  permissions: { user: 'Manage Channels', bot: ['Manage Channels', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const name = args[0] ? args.join('-') : null;
    if (!name) return message.reply('Please provide a new channel name.');
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[args.length - 1]) || message.channel;

    const perm = await permissionGuard.check(message, 'Manage Channels', ['Manage Channels']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      await channel.setName(name);
      return message.reply({ content: `Channel renamed to ${name}` });
    } catch (err) {
      return message.reply('Failed to rename channel.');
    }
  }
};
