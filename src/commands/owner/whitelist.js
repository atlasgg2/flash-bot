const whitelistRepo = require('../../repositories/whitelistRepository');
const ms = require('ms');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'whitelist',
  hidden: true,
  description: 'Grant whitelist access to a server (owner-only)',
  usage: '!whitelist <server_id> [duration|lifetime]',
  permissions: { user: 'Bot Owner', bot: [] },
  async execute(message, args){
    const authorId = message.author.id;
    // owner guard is handled in message handler; parse args
    const guildId = args[0];
    if(!guildId) return message.reply({ embeds: [ errorEmbed('Usage', 'Provide server (guild) ID.') ]});
    const durationArg = args[1];
    let durationMs = null;
    if(!durationArg || durationArg === 'lifetime'){
      durationMs = null;
    } else {
      const parsed = ms(durationArg);
      if(!parsed || parsed <= 0) return message.reply({ embeds: [ errorEmbed('Invalid duration', 'Use examples like 30m, 12h, 7d, 30d, 1y or lifetime') ]});
      // limit to 10 years
      const tenYears = 1000 * 60 * 60 * 24 * 365 * 10;
      if(parsed > tenYears) return message.reply({ embeds: [ errorEmbed('Duration too large', 'Maximum allowed is 10 years') ]});
      durationMs = parsed;
    }
    const row = whitelistRepo.addOrUpdateWhitelist(guildId, authorId, durationMs);
    const desc = row.lifetime ? 'Lifetime access granted' : `Expires at <t:${Math.floor(row.expires_at/1000)}:F>`;
    message.reply({ embeds: [ successEmbed('Whitelist updated', `Guild ${guildId} — ${desc}`) ]}).catch(()=>{});
  }
};
