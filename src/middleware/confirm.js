const { PermissionsBitField } = require('discord.js');

// Simple confirmation helper: asks user to type 'confirm' within 30 seconds.
// Returns true if confirmed, false otherwise.
async function confirmAction(message, prompt = 'Are you sure? Type `confirm` to proceed.', timeout = 30000) {
  const sent = await message.reply({ content: prompt });
  try {
    const filter = m => m.author.id === message.author.id && m.content.toLowerCase() === 'confirm';
    const collected = await message.channel.awaitMessages({ filter, max: 1, time: timeout, errors: ['time'] });
    await sent.delete().catch(() => {});
    const reply = collected.first();
    await reply.delete().catch(() => {});
    return true;
  } catch (e) {
    await sent.edit({ content: 'Confirmation timed out.' }).catch(() => {});
    return false;
  }
}

module.exports = { confirmAction };
