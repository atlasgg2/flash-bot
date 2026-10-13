const config = require('../../config');
const db = require('../../database/database');

module.exports = {
  name: 'delreminder',
  description: 'Delete one of your reminders',
  usage: '!delreminder <id>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    const id = Number(args[0]);
    if (!id) return message.reply('Usage: !delreminder <id>');
    const rows = db.listRemindersForUser(message.guild ? message.guild.id : 'dm', message.author.id);
    const target = rows.find(r => Number(r.id) === id);
    if (!target) return message.reply('Reminder not found.');
    db.deleteReminder(id);
    return message.reply({ embeds: [{ title: 'Reminder deleted', description: `Removed reminder #${id}.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
