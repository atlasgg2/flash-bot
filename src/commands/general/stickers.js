const config = require('../../config');

module.exports = {
  name: 'stickers',
  description: 'Lists stickers in the server.',
  usage: '!stickers',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const guild = message.guild;
    if (!guild) return message.reply('This command only works in a server.');
    const stickers = guild.stickers.cache.map(s => `${s.name} (${s.id})`).slice(0, 20).join('\n');
    return message.reply({ embeds: [{ title: `${guild.name} stickers`, description: stickers || 'No stickers found.', color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
