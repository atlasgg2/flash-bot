const config = require('../../config');

module.exports = {
  name: 'shop',
  description: 'Shows the fictional shop catalog',
  usage: '!shop',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message) {
    const text = '• Coffee 50\n• Pickaxe 150\n• Fishing Rod 180\n• Mystery Box 300';
    return message.reply({ embeds: [{ title: 'Shop', description: text, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
