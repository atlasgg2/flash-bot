const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'addrole',
  description: 'Add a role to a user',
  usage: '!addrole <user> <role>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Manage Roles', bot: ['Manage Roles', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name === args.slice(1).join(' '));
    if (!member || !role) return message.reply('Usage: !addrole <user> <role>');

    const perm = await permissionGuard.check(message, 'Manage Roles', ['Manage Roles'], { targetMember: member });
    if (!perm.ok) return message.reply(perm.reason);

    try {
      await member.roles.add(role);
      return message.reply({ content: `Added role ${role.name} to ${member.user.tag}` });
    } catch (err) {
      return message.reply('Failed to add role.');
    }
  }
};
