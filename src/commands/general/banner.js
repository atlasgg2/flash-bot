const config = require('../../config');

module.exports = {
  name: 'banner',
  description: 'Displays the profile banner for a user.',
  usage: '!banner [user]',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message, args) {
    const target = args[0] ? message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null) : message.author;
    if (!target) return message.reply('Could not find that user.');
    const bannerUrl = target.bannerURL({ dynamic: true, size: 1024 });
    if (!bannerUrl) return message.reply({ embeds: [{ title: 'No banner', description: `${target.username} does not have a profile banner set.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
    return message.reply({ embeds: [{ title: `${target.username}'s banner`, image: { url: bannerUrl }, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
