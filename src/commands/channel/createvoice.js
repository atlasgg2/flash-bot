const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'createvoice',
  description: 'Create a voice channel',
  usage: '!createvoice <name>',
  aliases: ['cv'],
  hidden: false,
  permissions: { user: 'Manage Channels', bot: ['Manage Channels', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const name = args.join('-') || null;
    if (!name) return message.reply('Please provide a channel name.');

    const perm = await permissionGuard.check(message, 'Manage Channels', ['Manage Channels']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      const ch = await message.guild.channels.create({ name: name, type: 2 });
      return message.reply({ content: `Voice channel created: ${ch}` });
    } catch (err) {
      return message.reply('Failed to create voice channel.');
    }
  }
};
