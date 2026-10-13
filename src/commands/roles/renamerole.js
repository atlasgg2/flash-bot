const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'renamerole',
  description: 'Rename a role',
  usage: '!renamerole <role> <newname>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Manage Roles', bot: ['Manage Roles', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args[0]);
    const newName = args.slice(1).join(' ');
    if (!role || !newName) return message.reply('Usage: !renamerole <role> <newname>');

    const perm = await permissionGuard.check(message, 'Manage Roles', ['Manage Roles']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      await role.setName(newName);
      return message.reply({ content: `Renamed role to ${newName}` });
    } catch (err) {
      return message.reply('Failed to rename role.');
    }
  }
};
