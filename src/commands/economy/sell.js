const config = require('../../config');
const economy = require('../../services/economy/economyRepo');

module.exports = {
  name: 'sell',
  description: 'Sell an item you own',
  usage: '!sell <item>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    const item = args.join(' ').trim();
    if (!item) return message.reply('Usage: !sell <item>');
    const account = economy.ensureAccount(message.guild ? message.guild.id : 'dm', message.author.id);
    const values = { coffee: 25, pickaxe: 75, 'fishing rod': 90, 'mystery box': 150 };
    const value = values[item.toLowerCase()];
    if (!value) return message.reply('That item cannot be sold.');
    economy.setEconomyAccount(message.guild ? message.guild.id : 'dm', message.author.id, Number(account.wallet || 0) + value, Number(account.bank || 0));
    return message.reply({ embeds: [{ title: 'Item sold', description: `You sold ${item} for ${value} fictional credits.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
