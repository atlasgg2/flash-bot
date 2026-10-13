const permissionGuard = require('../../middleware/permissionGuard');
const db = require('../../database/database');

module.exports = {
  name: 'tempchannel',
  description: 'Create a temporary channel that expires in a given time (e.g., 30m, 2h)',
  usage: '!tempchannel <name> <duration>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Manage Channels', bot: ['Manage Channels', 'View Channels', 'Send Messages'] },
  async execute(message, args) {
    if (!message.guild) return message.reply('This command must be used in a server.');
    const name = args[0] || null;
    const dur = args[1] || null;
    if (!name || !dur) return message.reply('Usage: !tempchannel <name> <duration> (e.g., 30m)');
    const ms = require('ms');
    const msDur = ms(dur);
    if (!msDur || msDur <= 0) return message.reply('Invalid duration.');

    const perm = await permissionGuard.check(message, 'Manage Channels', ['Manage Channels']);
    if (!perm.ok) return message.reply(perm.reason);

    try {
      const ch = await message.guild.channels.create({ name: name, type: 0 });
      const expiresAt = Date.now() + msDur;
      db.getDB().prepare('INSERT INTO temp_channels (guild_id, channel_id, expires_at) VALUES (?, ?, ?)').run(message.guild.id, ch.id, expiresAt);
      return message.reply({ content: `Temporary channel ${ch} created and will expire <t:${Math.floor(expiresAt/1000)}:R>.` });
    } catch (err) {
      return message.reply('Failed to create temporary channel.');
    }
  }
};
