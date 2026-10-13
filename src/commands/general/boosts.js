const config = require('../../config');

module.exports = {
  name: 'boosts',
  description: 'Shows current server boosts and premium level.',
  usage: '!boosts',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const guild = message.guild;
    if (!guild) return message.reply('This command only works in a server.');
    const premiumTier = guild.premiumTier ? guild.premiumTier.toString().replace('TIER_', 'Tier ') : 'None';
    const boosts = guild.premiumSubscriptionCount || 0;
    return message.reply({ embeds: [{ title: 'Server boosts', description: `Tier: ${premiumTier}\nBoosts: ${boosts}`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
