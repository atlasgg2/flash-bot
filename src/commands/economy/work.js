const config = require('../../config');
const economy = require('../../services/economy/economyRepo');

module.exports = {
  name: 'work',
  description: 'Do a fictional job for a random reward',
  usage: '!work',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message) {
    const guildId = message.guild ? message.guild.id : 'dm';
    const remaining = economy.getCooldown(guildId, message.author.id, 'work');
    if (remaining > 0) return message.reply({ embeds: [{ title: 'Work cooldown active', description: `Please wait ${Math.ceil(remaining / 1000)}s before working again.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
    const reward = 50 + Math.floor(Math.random() * 200);
    const account = economy.ensureAccount(guildId, message.author.id);
    economy.setEconomyAccount(guildId, message.author.id, Number(account.wallet || 0) + reward, Number(account.bank || 0));
    economy.setCooldown(guildId, message.author.id, 'work', 600000);
    return message.reply({ embeds: [{ title: 'Work complete', description: `You earned ${reward} fictional credits.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
