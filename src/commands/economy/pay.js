const config = require('../../config');
const economy = require('../../services/economy/economyRepo');

module.exports = {
  name: 'pay',
  description: 'Send fictional credits to another user',
  usage: '!pay <user> <amount>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    const guildId = message.guild ? message.guild.id : 'dm';
    const targetUser = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null);
    const amount = Number(args[1] || 0);
    if (!targetUser || !amount || amount <= 0) return message.reply('Usage: !pay <user> <amount>');
    if (targetUser.id === message.author.id) return message.reply('You cannot pay yourself.');
    const from = economy.ensureAccount(guildId, message.author.id);
    if (Number(from.wallet || 0) < amount) return message.reply('You do not have enough funds.');
    const to = economy.ensureAccount(guildId, targetUser.id);
    economy.setEconomyAccount(guildId, message.author.id, Number(from.wallet || 0) - amount, Number(from.bank || 0));
    economy.setEconomyAccount(guildId, targetUser.id, Number(to.wallet || 0) + amount, Number(to.bank || 0));
    return message.reply({ embeds: [{ title: 'Payment sent', description: `Paid ${amount} fictional credits to <@${targetUser.id}>.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
