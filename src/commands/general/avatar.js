const config = require('../../config');

module.exports = {
  name: 'avatar',
  description: 'Displays the full avatar for a user.',
  usage: '!avatar [user]',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message, args) {
    const target = args[0] ? message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null) : message.author;
    if (!target) return message.reply('Could not find that user.');
    return message.reply({ embeds: [{ title: `${target.username}'s avatar`, image: { url: target.displayAvatarURL({ dynamic: true, size: 1024 }) }, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
