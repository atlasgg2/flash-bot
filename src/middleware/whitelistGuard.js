const whitelistRepo = require('../repositories/whitelistRepository');

async function checkGuildWhitelisted(message){
  if(!message.guild) return; // allow DMs for commands that support it
  const guildId = message.guild.id;
  const ok = whitelistRepo.isWhitelisted(guildId);
  if(!ok) throw new Error('GUILD_NOT_WHITELISTED');
}

module.exports = { checkGuildWhitelisted };
