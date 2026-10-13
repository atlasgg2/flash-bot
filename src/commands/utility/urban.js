const config = require('../../config');

module.exports = {
  name: 'urban',
  description: 'Search Urban Dictionary for a phrase',
  usage: '!urban <term>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Embed Links'] },
  async execute(message, args) {
    const term = args.join(' ');
    if (!term) return message.reply('Usage: !urban <term>');
    return message.reply({ embeds: [{ title: 'Urban Dictionary', description: `Urban lookup for ${term} is temporarily unavailable. Try: https://www.google.com/search?q=${encodeURIComponent(term + ' urban dictionary')}`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
