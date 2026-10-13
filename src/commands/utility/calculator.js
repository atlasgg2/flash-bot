const config = require('../../config');
const { safeMoney } = require('../../utils/validators');

module.exports = {
  name: 'calculator',
  description: 'Safely evaluate a simple arithmetic expression',
  usage: '!calculator <expr>',
  aliases: [],
  hidden: false,
  permissions: { user: 'Everyone', bot: ['View Channels', 'Send Messages'] },
  async execute(message, args) {
    const expr = args.join(' ');
    if (!expr) return message.reply('Usage: !calculator <expr>');
    if (!/^[0-9+\-*/().%\s]+$/.test(expr)) return message.reply('Only arithmetic operators and numbers are supported.');
    try {
      const result = Function(`"use strict"; return (${expr});`)();
      if (!Number.isFinite(result)) throw new Error('Invalid math');
      return message.reply({ embeds: [{ title: 'Calculator', description: `Result: ${result}`, color: Number.parseInt((config.EMBED_COLOR || '#5865F2').replace('#', ''), 16) || 0x5865F2 }] });
    } catch (err) {
      return message.reply('Invalid expression or unsupported arithmetic.');
    }
  }
};
