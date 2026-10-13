const config = require('../../config');

module.exports = {
  name: 'invite',
  description: 'Shows the bot invite link.',
  usage: '!invite',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const invite = process.env.INVITE_URL || 'https://discord.com/oauth2/authorize';
    return message.reply({ embeds: [{ title: 'Invite the bot', description: `[Click here to invite Flash](${invite})`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
  }
};
