const config = require('../../config');
const economy = require('../../services/economy/economyRepo');

module.exports = {
  name: 'weekly',
  description: 'Claim a weekly fictional reward',
  usage: '!weekly',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message) {
    const guildId = message.guild ? message.guild.id : 'dm';
    const remaining = economy.getCooldown(guildId, message.author.id, 'weekly');
    if (remaining > 0) return message.reply({ embeds: [{ title: 'Weekly reward unavailable', description: `Please wait ${Math.ceil(remaining / 1000)}s before claiming again.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
    const account = economy.ensureAccount(guildId, message.author.id);
    const reward = 1000;
    const next = { wallet: Number(account.wallet || 0) + reward, bank: Number(account.bank || 0) };
    economy.setEconomyAccount(guildId, message.author.id, next.wallet, next.bank);
    economy.setCooldown(guildId, message.author.id, 'weekly', 604800000);
    return message.reply({ embeds: [{ title: 'Weekly reward claimed', description: `You received ${reward} fictional credits.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
