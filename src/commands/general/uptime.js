const config = require('../../config');

module.exports = {
  name: 'uptime',
  description: 'Shows the bot uptime.',
  usage: '!uptime',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const secs = Math.floor(process.uptime());
    const days = Math.floor(secs / 86400);
    const hours = Math.floor((secs % 86400) / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const rem = secs % 60;
    const uptime = `${days}d ${hours}h ${mins}m ${rem}s`;
    return message.reply({ embeds: [{ title: 'Uptime', description: `Flash has been online for ${uptime}.`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
