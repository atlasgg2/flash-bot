const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'deleterole',
  description: 'Delete a role',
  usage: '!deleterole <role>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Manage Roles', bot: ['Manage Roles', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(' '));
    if (!role) return message.reply('Role not found.');

    const perm = await permissionGuard.check(message, 'Manage Roles', ['Manage Roles']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      await role.delete('Deleted by command');
      return message.reply({ content: `Deleted role ${role.name}` });
    } catch (err) {
      return message.reply('Failed to delete role.');
    }
  }
};
