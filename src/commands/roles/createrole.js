const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'createrole',
  description: 'Create a role',
  usage: '!createrole <name> [color]',
  aliases: [],
  hidden: false,
  permissions: { user: 'Manage Roles', bot: ['Manage Roles', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const name = args[0];
    const color = args[1] || null;
    if (!name) return message.reply('Please provide a role name.');

    const perm = await permissionGuard.check(message, 'Manage Roles', ['Manage Roles']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      const role = await message.guild.roles.create({ name, color: color || undefined });
      return message.reply({ content: `Created role ${role.name}` });
    } catch (err) {
      return message.reply('Failed to create role.');
    }
  }
};
