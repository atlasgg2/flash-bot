const config = require('../../config');

module.exports = {
  name: 'vote',
  description: 'Shows the voting link.',
  usage: '!vote',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const vote = process.env.VOTE_URL || 'https://example.com/vote';
    return message.reply({ embeds: [{ title: 'Vote', description: `[Vote for Flash](${vote})`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
