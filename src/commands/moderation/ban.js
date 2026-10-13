const permissionGuard = require('../../middleware/permissionGuard');
const logger = require('../../logger');

module.exports = {
  name: 'ban',
  description: 'Ban a member from the server',
  usage: '!ban <user> [reason]',
  aliases: [],
  hidden: false,
  permissions: { user: 'Ban Members', bot: ['Ban Members', 'View Channels', 'Send Messages', 'Read Message History'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const mention = message.mentions.members.first();
    const id = args[0] && !mention ? args[0] : mention ? mention.id : null;
    if (!id) return message.reply('Please specify a user to ban.');
    const target = await message.guild.members.fetch(id).catch(() => null);
    if (!target) return message.reply('Member not found.');

    const perm = await permissionGuard.check(message, 'Ban Members', ['Ban Members'], { targetMember: target });
    if (!perm.ok) return message.reply(perm.reason);

    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
      await target.ban({ reason });
      return message.reply({ embeds: [{ title: 'Member banned', description: `${target.user.tag} has been banned.`, color: 0x2ECC71 }] });
    } catch (err) {
      logger.error('Ban failed', err);
      return message.reply('Failed to ban the member. Do I have the right permissions?');
    }
  }
};
