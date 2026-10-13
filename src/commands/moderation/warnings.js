const db = require('../../database/database');

module.exports = {
  name: 'warnings',
  description: 'List warnings for a user',
  usage: '!warnings <user>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Moderate Members', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const mention = message.mentions.users.first();
    const id = args[0] && !mention ? args[0] : mention ? mention.id : null;
    if (!id) return message.reply('Please specify a user.');
    const rows = db.getWarnings(message.guild.id, id);
    if (!rows || rows.length === 0) return message.reply('No warnings found for that user.');
    const lines = rows.map(r => `#${r.id} by <@${r.moderator_id}> on <t:${Math.floor(r.created_at/1000)}:F> — ${r.reason}`);
    return message.reply({ embeds: [{ title: `Warnings for ${id}`, description: lines.join('\n\n').slice(0, 4000), color: 0xF1C40F }] });
  }
};
