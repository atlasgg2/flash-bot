const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { loadCommands } = require('./commandHandler');
const config = require('../config');
const logger = require('../logger');
const db = require('../database/database');
const whitelistRepo = require('../repositories/whitelistRepository');
const ownerGuard = require('../middleware/ownerGuard');
const whitelistGuard = require('../middleware/whitelistGuard');

let client;
let commands;

function createClient(){
  client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
  return client;
}

function registerHandlers(){
  commands = loadCommands();
  client.on('messageCreate', async message=>{
    try{
      if(message.author.bot) return;
      const guildPrefix = message.guild ? (getPrefixForGuild(message.guild.id) || config.DEFAULT_PREFIX) : config.DEFAULT_PREFIX;
      if(!message.content.startsWith(guildPrefix)) return;
      const args = message.content.slice(guildPrefix.length).trim().split(/ +/);
      const cmdName = args.shift().toLowerCase();
      const cmd = commands.get(cmdName);
      if(!cmd) return;
      // Owner-only hidden commands bypass whitelist check
      const isOwner = ownerGuard.isOwner(message.author.id);
      if(cmd.hidden && !isOwner){
        // ignore
        return;
      }
      if(cmd.hidden && isOwner){
        await cmd.execute(message, args, { client, commands, isOwner });
        return;
      }
      // check guild whitelist for ordinary commands
      try{
        await whitelistGuard.checkGuildWhitelisted(message);
      } catch(e){
        message.reply({ embeds: [ { title: 'Access denied', description: 'This server is not whitelisted to use the bot.', color: 0xFF0000 } ]}).catch(()=>{});
        return;
      }
      await cmd.execute(message, args, { client, commands, isOwner });
    }catch(err){
      logger.error('Command handler error', err && err.stack ? err.stack : err);
      try{ message.reply({ embeds: [ { title: 'Error', description: 'An internal error occurred.' , color: 0xFF0000 } ]}) }catch(e){}
    }
  });
}

function getPrefixForGuild(guildId){
  const dbx = db.getDB();
  const row = dbx.prepare('SELECT prefix FROM guild_settings WHERE guild_id = ?').get(guildId);
  return row ? row.prefix : null;
}

module.exports = { createClient, registerHandlers };
