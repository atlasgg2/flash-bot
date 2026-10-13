const permissionGuard = require('../../middleware/permissionGuard');
const logger = require('../../logger');

module.exports = {
  name: 'kick',
  description: 'Kick a member from the server',
  usage: '!kick <user> [reason]',
  aliases: [],
  hidden: false,
  permissions: { user: 'Kick Members', bot: ['Kick Members', 'View Channels', 'Send Messages', 'Read Message History'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const mention = message.mentions.members.first();
    const id = args[0] && !mention ? args[0] : mention ? mention.id : null;
    if (!id) return message.reply('Please specify a user to kick.');
    const target = await message.guild.members.fetch(id).catch(() => null);
    if (!target) return message.reply('Member not found.');

    const perm = await permissionGuard.check(message, 'Kick Members', ['Kick Members'], { targetMember: target });
    if (!perm.ok) return message.reply(perm.reason);

    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
      await target.kick(reason);
      return message.reply({ embeds: [{ title: 'Member kicked', description: `${target.user.tag} has been kicked.`, color: 0x2ECC71 }] });
    } catch (err) {
      logger.error('Kick failed', err);
      return message.reply('Failed to kick the member. Do I have the right permissions?');
    }
  }
};
