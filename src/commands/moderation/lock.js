const permissionGuard = require('../../middleware/permissionGuard');

module.exports = {
  name: 'lock',
  description: 'Lock the current channel (remove SEND_MESSAGES for @everyone)',
  usage: '!lock [channel]',
  aliases: [],
  hidden: false,
  permissions: { user: 'Manage Channels', bot: ['Manage Channels', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const channel = args[0] ? message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) : message.channel;
    if (!channel) return message.reply('Channel not found.');

    const perm = await permissionGuard.check(message, 'Manage Channels', ['Manage Channels']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      return message.reply({ embeds: [{ title: 'Channel locked', description: `${channel.toString()} is now locked.`, color: 0xE67E22 }] });
    } catch (err) {
      return message.reply('Failed to lock the channel. Do I have Manage Channels permission?');
    }
  }
};
