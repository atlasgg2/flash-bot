const config = require('../../config');

module.exports = {
  name: 'serverinfo',
  description: 'Shows information about the current server.',
  usage: '!serverinfo',
  aliases: ['guildinfo'],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const guild = message.guild;
    if (!guild) return message.reply('This command only works in a server.');
    const owner = await guild.fetchOwner().catch(() => null);
    const embed = {
      title: guild.name,
      description: guild.description || 'No server description set.',
      color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2,
      thumbnail: guild.iconURL ? { url: guild.iconURL({ dynamic: true, size: 256 }) } : null,
      fields: [
        { name: 'Owner', value: owner ? `<@${owner.id}>` : 'Unknown' },
        { name: 'Members', value: String(guild.memberCount), inline: true },
        { name: 'Roles', value: String(guild.roles.cache.size), inline: true },
        { name: 'Boosts', value: String(guild.premiumSubscriptionCount || 0), inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: false }
      ]
    };
    return message.reply({ embeds: [embed] });
  }
};
