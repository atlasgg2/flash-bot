const db = require('../../database/database');

module.exports = {
  name: 'antibot',
  description: 'Toggle antibot on/off',
  usage: '!antibot <on|off>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Administrator', bot: ['View Channels', 'Send Messages', 'Kick Members'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const val = args[0] ? args[0].toLowerCase() : null;
    if (!val || !['on','off'].includes(val)) return message.reply('Usage: !antibot <on|off>');
    const on = val === 'on' ? 1 : 0;
    db.setAntiraidSetting(message.guild.id, 'antibot_on', on);
    return message.reply({ content: `Antibot turned ${val}` });
  }
};
