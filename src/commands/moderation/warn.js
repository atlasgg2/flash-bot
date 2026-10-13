const db = require('../../database/database');
const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'warn',
  description: 'Warn a member and persist the warning',
  usage: '!warn <user> <reason>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Moderate Members', bot: ['View Channels', 'Send Messages', 'Read Message History'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const mention = message.mentions.users.first();
    const id = args[0] && !mention ? args[0] : mention ? mention.id : null;
    if (!id) return message.reply('Please specify a user to warn.');
    const targetMember = await message.guild.members.fetch(id).catch(() => null);
    if (!targetMember) return message.reply('Member not found.');

    const perm = await permissionGuard.check(message, 'Moderate Members', [], { targetMember });
    if (!perm.ok) return message.reply(perm.reason);

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const row = db.addWarning(message.guild.id, id, message.author.id, reason);
    return message.reply({ embeds: [{ title: 'Warning added', description: `Warned <@${id}> (id: ${row.id}).`, color: 0xF1C40F }] });
  }
};
