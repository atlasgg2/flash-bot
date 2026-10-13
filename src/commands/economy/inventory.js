const config = require('../../config');
const economy = require('../../services/economy/economyRepo');

module.exports = {
  name: 'inventory',
  description: 'Shows your item inventory',
  usage: '!inventory',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message) {
    return message.reply({ embeds: [{ title: 'Inventory', description: 'Your inventory is empty. Use the shop to buy items.', color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
