const config = require('../../config');

module.exports = {
  name: 'userinfo',
  description: 'Shows info about a member or the author.',
  usage: '!userinfo [user]',
  aliases: ['memberinfo'],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message, args) {
    const target = args[0] ? message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null) : message.author;
    if (!target) return message.reply('Could not find that user.');
    const member = message.guild ? message.guild.members.cache.get(target.id) || await message.guild.members.fetch(target.id).catch(() => null) : null;
    const roles = member ? member.roles.cache.filter(r => r.id !== message.guild.id).sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, 10).join(', ') || 'No additional roles' : 'Not in this server';
    const avatar = target.displayAvatarURL({ dynamic: true, size: 256 });
    const embed = {
      title: `${target.username}#${target.discriminator}`,
      thumbnail: { url: avatar },
      color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2,
      fields: [
        { name: 'ID', value: target.id, inline: true },
        { name: 'Created', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`, inline: true },
        { name: 'Joined', value: member ? `<t:${Math.floor((member.joinedTimestamp || 0) / 1000)}:F>` : 'N/A', inline: true },
        { name: 'Roles', value: roles, inline: false }
      ]
    };
    return message.reply({ embeds: [embed] });
  }
};
