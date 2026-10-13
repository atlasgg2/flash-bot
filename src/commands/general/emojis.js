const config = require('../../config');

module.exports = {
  name: 'emojis',
  description: 'Lists custom emojis in the server.',
  usage: '!emojis',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const guild = message.guild;
    if (!guild) return message.reply('This command only works in a server.');
    const emojis = guild.emojis.cache.map(e => `${e.toString()} \`${e.name}\``).slice(0, 30).join(' ');
    return message.reply({ embeds: [{ title: `${guild.name} emojis`, description: emojis || 'No custom emojis found.', color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
