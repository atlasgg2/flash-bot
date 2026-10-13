const config = require('../../config');

module.exports = {
  name: 'channelinfo',
  description: 'Shows information about a channel',
  usage: '!channelinfo [#channel]',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message, args) {
    const channel = message.mentions.channels.first() || message.guild?.channels.cache.get(args[0]) || message.channel;
    if (!channel) return message.reply('Channel not found.');
    const embed = {
      title: `#${channel.name}`,
      description: channel.topic || 'No topic set',
      fields: [
        { name: 'ID', value: channel.id, inline: true },
        { name: 'Type', value: channel.type.toString(), inline: true },
        { name: 'Created', value: `<t:${Math.floor(channel.createdTimestamp/1000)}:F>`, inline: false }
      ],
      color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#',''), 16) || 0x5865F2
    };
    return message.reply({ embeds: [embed] });
  }
};
