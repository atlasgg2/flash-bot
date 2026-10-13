const config = require('../../config');

module.exports = {
  name: 'stats',
  description: 'Shows current host and process stats.',
  usage: '!stats',
  aliases: ['systemstats'],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const mem = process.memoryUsage();
    const stats = {
      mem: `${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB heap used`,
      rss: `${(mem.rss / 1024 / 1024).toFixed(1)} MB RSS`,
      uptime: `${Math.floor(process.uptime())}s`,
      cpus: require('os').cpus().length
    };
    return message.reply({ embeds: [{ title: 'Runtime stats', description: `CPU cores: ${stats.cpus}\nUptime: ${stats.uptime}\nMemory: ${stats.mem}\nRSS: ${stats.rss}`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
