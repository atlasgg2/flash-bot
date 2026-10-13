const config = require('../../config');
const economy = require('../../services/economy/economyRepo');

module.exports = {
  name: 'rob',
  description: 'Attempt to rob another user with a risk',
  usage: '!rob <user>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    const guildId = message.guild ? message.guild.id : 'dm';
    const targetUser = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
    if (!targetUser || targetUser.id === message.author.id) return message.reply('Please mention a different user.');
    const remaining = economy.getCooldown(guildId, message.author.id, 'rob');
    if (remaining > 0) return message.reply({ embeds: [{ title: 'Rob cooldown active', description: `Please wait ${Math.ceil(remaining / 1000)}s before trying again.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
    const chance = Math.random();
    const account = economy.ensureAccount(guildId, message.author.id);
    const target = economy.ensureAccount(guildId, targetUser.id);
    if (chance < 0.5) {
      const loss = 25 + Math.floor(Math.random() * 50);
      economy.setEconomyAccount(guildId, message.author.id, Math.max(0, Number(account.wallet || 0) - loss), Number(account.bank || 0));
      economy.setCooldown(guildId, message.author.id, 'rob', 300000);
      return message.reply({ embeds: [{ title: 'Rob failed', description: `You got caught and lost ${loss} fictional credits.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
    }
    const stolen = 30 + Math.floor(Math.random() * 100);
    economy.setEconomyAccount(guildId, message.author.id, Number(account.wallet || 0) + stolen, Number(account.bank || 0));
    economy.setEconomyAccount(guildId, targetUser.id, Math.max(0, Number(target.wallet || 0) - stolen), Number(target.bank || 0));
    economy.setCooldown(guildId, message.author.id, 'rob', 300000);
    return message.reply({ embeds: [{ title: 'Rob successful', description: `You stole ${stolen} fictional credits from <@${targetUser.id}>.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
