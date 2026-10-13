const { version, dependencies } = require('../../../package.json');
const config = require('../../config');

module.exports = {
  name: 'botinfo',
  description: 'Shows general bot information.',
  usage: '!botinfo',
  aliases: ['info', 'about'],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const discordjs = dependencies['discord.js'];
    const text = `Flash is a modular Discord bot built for HeavenCloud India.\n` +
      `Framework: Discord.js ${discordjs}\n` +
      `Node runtime: ${process.version}\n` +
      `Process uptime: ${Math.floor(process.uptime())}s`;

    return message.reply({
      embeds: [{
        title: 'Bot Information',
        description: text,
        color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2,
        footer: { text: `Flash v${version}` }
      }]
    });
  }
};
