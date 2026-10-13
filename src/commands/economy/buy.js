const config = require('../../config');
const economy = require('../../services/economy/economyRepo');

module.exports = {
  name: 'buy',
  description: 'Buy an item from the shop',
  usage: '!buy <item>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    const item = args.join(' ').trim();
    if (!item) return message.reply('Usage: !buy <item>');
    const account = economy.ensureAccount(message.guild ? message.guild.id : 'dm', message.author.id);
    const prices = { coffee: 50, pickaxe: 150, 'fishing rod': 180, 'mystery box': 300 };
    const price = prices[item.toLowerCase()];
    if (!price) return message.reply('That item is not in the shop.');
    if (Number(account.wallet || 0) < price) return message.reply('You cannot afford that item.');
    economy.setEconomyAccount(message.guild ? message.guild.id : 'dm', message.author.id, Number(account.wallet || 0) - price, Number(account.bank || 0));
    return message.reply({ embeds: [{ title: 'Purchase complete', description: `You bought ${item} for ${price} fictional credits.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
