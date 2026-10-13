const permissionGuard = require('../../middleware/permissionGuard');
const logger = require('../../logger');

module.exports = {
  name: 'purge',
  description: 'Bulk delete messages (1-100)',
  usage: '!purge <amount>',
  aliases: ['clear'],
  hidden: false,
  permissions: { user: 'Manage Messages', bot: ['Manage Messages', 'View Channels', 'Send Messages', 'Read Message History'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const amount = parseInt(args[0], 10);
    if (isNaN(amount) || amount < 1 || amount > 100) return message.reply('Provide an amount between 1 and 100.');

    const perm = await permissionGuard.check(message, 'Manage Messages', ['Manage Messages']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      const deleted = await message.channel.bulkDelete(amount, true);
      return message.reply({ content: `Deleted ${deleted.size} messages.` }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000)).catch(() => {});
    } catch (err) {
      logger.error('Purge failed', err);
      return message.reply('Failed to delete messages. Messages older than 14 days cannot be bulk deleted.');
    }
  }
};
