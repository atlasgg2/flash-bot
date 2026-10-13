const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'createchannel',
  description: 'Create a text channel',
  usage: '!createchannel <name>',
  aliases: ['cc'],
  hidden: false,
  permissions: { user: 'Manage Channels', bot: ['Manage Channels', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const name = args.join('-') || null;
    if (!name) return message.reply('Please provide a channel name.');

    const perm = await permissionGuard.check(message, 'Manage Channels', ['Manage Channels']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      const ch = await message.guild.channels.create({ name: name, type: 0 });
      return message.reply({ content: `Channel created: ${ch}` });
    } catch (err) {
      return message.reply('Failed to create channel.');
    }
  }
};
