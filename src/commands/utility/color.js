const config = require('../../config');
const { isHexColor } = require('../../utils/validators');

module.exports = {
  name: 'color',
  description: 'Preview a color by its hex code',
  usage: '!color <hex>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    const hex = args[0] || '#5865F2';
    if (!isHexColor(hex)) return message.reply('Please provide a valid hex color like #5865F2');
    const normalized = hex.startsWith('#') ? hex : '#' + hex;
    return message.reply({ embeds: [{ title: 'Color preview', description: `${normalized} preview`, color: Number.parseInt(normalized.replace('#',''), 16) || 0x5865F2 }] });
  }
};
