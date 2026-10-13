const db = require('../../database/database');

module.exports = {
  name: 'wordfilter',
  description: 'Manage word filter: add/del/list',
  usage: '!wordfilter <add|del|list> <word>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Administrator', bot: ['View Channels', 'Send Messages', 'Manage Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('Use in server.');
    const action = args[0] ? args[0].toLowerCase() : null;
    if (!action || !['add','del','list'].includes(action)) return message.reply('Usage: !wordfilter <add|del|list> <word>');
    if (action === 'list') {
      const list = db.listWordfilters(message.guild.id);
      if (!list || list.length === 0) return message.reply('No wordfilters set.');
      const lines = list.map(l => `${l.word} — set by <@${l.created_by}>`);
      return message.reply({ content: lines.join('\n') });
    }
    const word = args[1];
    if (!word) return message.reply('Provide a word to add/remove.');
    if (action === 'add') {
      db.addWordfilter(message.guild.id, word, message.author.id);
      return message.reply(`Added wordfilter: ${word}`);
    }
    if (action === 'del') {
      db.removeWordfilter(message.guild.id, word);
      return message.reply(`Removed wordfilter: ${word}`);
    }
  }
};
