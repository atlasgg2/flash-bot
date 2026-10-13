const config = require('../../config');
const economy = require('../../services/economy/economyRepo');

module.exports = {
  name: 'balance',
  description: 'Check your wallet and bank balance',
  usage: '!balance',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message) {
    const guildId = message.guild ? message.guild.id : 'dm';
    const account = economy.ensureAccount(guildId, message.author.id);
    return message.reply({ embeds: [{ title: 'Balance', description: `Wallet: ${account.wallet}\nBank: ${account.bank}\nTotal: ${Number(account.wallet) + Number(account.bank)}`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
