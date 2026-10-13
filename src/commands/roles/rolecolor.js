const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'rolecolor',
  description: 'Set a role color (hex)',
  usage: '!rolecolor <role> <hex>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Manage Roles', bot: ['Manage Roles', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args[0]);
    const hex = args[1];
    if (!role || !hex) return message.reply('Usage: !rolecolor <role> <hex>');
    if (!/^#?[0-9A-Fa-f]{6}$/.test(hex)) return message.reply('Provide a valid hex color like #FF0000');

    const perm = await permissionGuard.check(message, 'Manage Roles', ['Manage Roles']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      await role.setColor(hex);
      return message.reply({ content: `Set color of ${role.name} to ${hex}` });
    } catch (err) {
      return message.reply('Failed to set role color.');
    }
  }
};
