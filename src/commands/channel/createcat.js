const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'createcat',
  description: 'Create a category',
  usage: '!createcat <name>',
  aliases: ['ccat'],
  hidden: false,
  permissions: { user: 'Manage Channels', bot: ['Manage Channels', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const name = args.join(' ') || null;
    if (!name) return message.reply('Please provide a category name.');

    const perm = await permissionGuard.check(message, 'Manage Channels', ['Manage Channels']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      const ch = await message.guild.channels.create({ name: name, type: 4 });
      return message.reply({ content: `Category created: ${ch}` });
    } catch (err) {
      return message.reply('Failed to create category.');
    }
  }
};
