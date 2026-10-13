const db = require('../../database/database');

module.exports = {
  name: 'antiflood',
  description: 'Toggle antiflood on/off',
  usage: '!antiflood <on|off>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Administrator', bot: ['View Channels', 'Send Messages', 'Manage Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const val = args[0] ? args[0].toLowerCase() : null;
    if (!val || !['on','off'].includes(val)) return message.reply('Usage: !antiflood <on|off>');
    const on = val === 'on' ? 1 : 0;
    db.setAntiraidSetting(message.guild.id, 'antiflood_on', on);
    return message.reply({ content: `Antiflood turned ${val}` });
  }
};
