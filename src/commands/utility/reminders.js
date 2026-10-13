const config = require('../../config');
const db = require('../../database/database');

module.exports = {
  name: 'reminders',
  description: 'List reminders you created',
  usage: '!reminders',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Embed Links'] },
  async execute(message) {
    const guildId = message.guild ? message.guild.id : 'dm';
    const rows = db.listRemindersForUser(guildId, message.author.id);
    if (!rows.length) return message.reply('You have no active reminders.');
    const lines = rows.map(r => `#${r.id} — <t:${Math.floor(r.due_at / 1000)}:F> — ${r.text}`);
    return message.reply({ embeds: [{ title: 'Your reminders', description: lines.join('\n'), color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
