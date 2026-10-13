const config = require('../../config');
const economy = require('../../services/economy/economyRepo');

module.exports = {
  name: 'monthly',
  description: 'Claim a monthly fictional reward',
  usage: '!monthly',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message) {
    const guildId = message.guild ? message.guild.id : 'dm';
    const remaining = economy.getCooldown(guildId, message.author.id, 'monthly');
    if (remaining > 0) return message.reply({ embeds: [{ title: 'Monthly reward unavailable', description: `Please wait ${Math.ceil(remaining / 1000)}s before claiming again.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
    const account = economy.ensureAccount(guildId, message.author.id);
    const reward = 5000;
    const next = { wallet: Number(account.wallet || 0) + reward, bank: Number(account.bank || 0) };
    economy.setEconomyAccount(guildId, message.author.id, next.wallet, next.bank);
    economy.setCooldown(guildId, message.author.id, 'monthly', 2592000000);
    return message.reply({ embeds: [{ title: 'Monthly reward claimed', description: `You received ${reward} fictional credits.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
