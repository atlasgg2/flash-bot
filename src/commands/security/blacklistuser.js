const db = require('../../database/database');

module.exports = {
  name: 'blacklistuser',
  description: 'Blacklist a user from using the bot in this server',
  usage: '!blacklistuser <user>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Administrator', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('Use in server.');
    const user = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(()=>null);
    if (!user) return message.reply('User not found.');
    db.addBlacklistUser(message.guild.id, user.id, message.author.id);
    return message.reply({ content: `User ${user.tag} blacklisted.` });
  }
};
