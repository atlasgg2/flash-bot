const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'channelbitrate',
  description: 'Set bitrate for a voice channel (kbps)',
  usage: '!channelbitrate <kbps> [#voice]',
  aliases: ['vbitrate'],
  hidden: false,
  permissions: { user: 'Manage Channels', bot: ['Manage Channels', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const kbps = parseInt(args[0], 10);
    if (isNaN(kbps) || kbps < 8 || kbps > 384) return message.reply('Provide a valid bitrate in kbps (8-384).');
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel;
    if (!channel || channel.type !== 2) return message.reply('Target must be a voice channel.');

    const perm = await permissionGuard.check(message, 'Manage Channels', ['Manage Channels']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      await channel.setBitrate(kbps * 1000);
      return message.reply({ content: `Set bitrate to ${kbps}kbps for ${channel.name}` });
    } catch (err) {
      return message.reply('Failed to set bitrate.');
    }
  }
};
