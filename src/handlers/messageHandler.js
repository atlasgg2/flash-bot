const { Client, GatewayIntentBits } = require('discord.js');
const { loadCommands } = require('./commandHandler');
const config = require('../config');
const logger = require('../logger');
const db = require('../database/database');
const ownerGuard = require('../middleware/ownerGuard');
const whitelistGuard = require('../middleware/whitelistGuard');

let client;
let commands;

function createClient() {
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences
    ]
  });
  return client;
}

function registerHandlers() {
  commands = loadCommands();
  client.on('messageCreate', async (message) => {
    try {
      if (message.author.bot) return;

      const prefix = message.guild ? (db.getGuildPrefix(message.guild.id) || config.DEFAULT_PREFIX) : config.DEFAULT_PREFIX;
      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/\s+/);
      const cmdName = args.shift().toLowerCase();
      if (!cmdName) return;

      const cmd = commands.get(cmdName); 
      if (!cmd) return;

      const isOwner = ownerGuard.isOwner(message.author.id);
      if (cmd.hidden && !isOwner) return;

      if (message.guild && !cmd.hidden) {
        try {
          await whitelistGuard.checkGuildWhitelisted(message);
        } catch (err) {
          return message.reply({
            embeds: [{
              title: 'Access denied',
              description: 'This server is not whitelisted for bot use.',
              color: 0xE74C3C
            }]
          }).catch(() => {});
        }
      }

      await cmd.execute(message, args, { client, commands, isOwner, prefix });
    } catch (err) {
      logger.error('Command execution failed', err && err.stack ? err.stack : err);
      try {
        message.reply({ embeds: [{ title: 'Error', description: 'An internal error occurred.', color: 0xE74C3C }] });
      } catch (e) {}
    }
  });
}

module.exports = { createClient, registerHandlers };
