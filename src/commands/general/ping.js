const { readFileSync } = require('fs');
const path = require('path');
const config = require('../config');

function getRuntimeInfo() {
  const now = Date.now();
  const uptimeMs = process.uptime() * 1000;
  return { now, uptimeMs };
}

function buildEmbed(title, description, color = config.EMBED_COLOR) {
  return {
    title,
    description,
    color: Number.parseInt(color.replace('#', ''), 16) || 0x5865F2,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  name: 'ping',
  description: 'Checks the bot latency.',
  usage: '!ping',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages', 'Read Message History', 'Embed Links'] },
  async execute(message) {
    const before = Date.now();
    const reply = await message.reply({ content: 'Pinging...' }).catch(() => null);
    const after = Date.now();
    const latency = Math.max(0, after - before);
    if (!reply) return;
    await reply.edit({ content: `Pong! Latency: ${latency}ms` }).catch(() => {});
  }
};
