const config = require('../../config');
const economy = require('../../services/economy/economyRepo');

module.exports = {
  name: 'beg',
  description: 'Ask for a small fictional reward',
  usage: '!beg',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message) {
    const guildId = message.guild ? message.guild.id : 'dm';
    const remaining = economy.getCooldown(guildId, message.author.id, 'beg');
    if (remaining > 0) return message.reply({ embeds: [{ title: 'Beg cooldown active', description: `Please wait ${Math.ceil(remaining / 1000)}s before begging again.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
    const reward = 10 + Math.floor(Math.random() * 30);
    const account = economy.ensureAccount(guildId, message.author.id);
    economy.setEconomyAccount(guildId, message.author.id, Number(account.wallet || 0) + reward, Number(account.bank || 0));
    economy.setCooldown(guildId, message.author.id, 'beg', 120000);
    return message.reply({ embeds: [{ title: 'You begged successfully', description: `You received ${reward} fictional credits.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
