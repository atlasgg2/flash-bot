const config = require('../../config');

module.exports = {
  name: 'roleinfo',
  description: 'Show information about a role',
  usage: '!roleinfo <role>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Embed Links'] },
  async execute(message, args) {
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(' '));
    if (!role) return message.reply('Role not found.');
    const embed = {
      title: role.name,
      description: `ID: ${role.id}`,
      fields: [
        { name: 'Color', value: role.hexColor, inline: true },
        { name: 'Members', value: String(role.members.size), inline: true },
        { name: 'Mentionable', value: String(role.mentionable), inline: true }
      ],
      color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#',''), 16) || 0x5865F2
    };
    return message.reply({ embeds: [embed] });
  }
};
