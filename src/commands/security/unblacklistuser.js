const db = require('../../database/database');

module.exports = {
  name: 'unblacklistuser',
  description: 'Remove a user from the bot blacklist',
  usage: '!unblacklistuser <user>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Administrator', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('Use in server.');
    const user = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(()=>null);
    if (!user) return message.reply('User not found.');
    db.removeBlacklistUser(message.guild.id, user.id);
    return message.reply({ content: `User ${user.tag} removed from blacklist.` });
  }
};
