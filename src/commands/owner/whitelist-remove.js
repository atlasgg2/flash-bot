const whitelistRepo = require('../../repositories/whitelistRepository');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  name: 'whitelist-remove',
  hidden: true,
  description: 'Remove a guild from the whitelist (owner-only)',
  usage: '!whitelist-remove <server_id>',
  permissions: { user: 'Bot Owner', bot: [] },
  async execute(message, args){
    const guildId = args[0];
    if(!guildId) return message.reply({ embeds: [ errorEmbed('Usage', 'Provide server (guild) ID.') ]});
    const existed = whitelistRepo.removeWhitelist(guildId);
    if(existed) message.reply({ embeds: [ successEmbed('Removed', `Whitelist entry for ${guildId} removed.`) ]}).catch(()=>{});
    else message.reply({ embeds: [ errorEmbed('Not found', `No whitelist entry found for ${guildId}.`) ]}).catch(()=>{});
  }
};
