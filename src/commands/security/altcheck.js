const db = require('../../database/database');

module.exports = {
  name: 'altcheck',
  description: 'Configure alt check - number of days for new accounts to be flagged. Use 0 to disable.',
  usage: '!altcheck <days>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Administrator', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const days = parseInt(args[0], 10);
    if (isNaN(days) || days < 0) return message.reply('Provide a non-negative number of days, or 0 to disable.');
    db.setAntiraidSetting(message.guild.id, 'altcheck_days', days);
    return message.reply({ content: `Alt-check configured to ${days} days.` });
  }
};
