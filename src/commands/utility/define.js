const config = require('../../config');

module.exports = {
  name: 'define',
  description: 'Lookup a dictionary definition',
  usage: '!define <word>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Embed Links'] },
  async execute(message, args) {
    const word = args.join(' ');
    if (!word) return message.reply('Usage: !define <word>');
    return message.reply({ embeds: [{ title: 'Dictionary', description: `Definition lookup for ${word} is temporarily unavailable. Try: https://www.google.com/search?q=${encodeURIComponent(word + ' definition')}`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
