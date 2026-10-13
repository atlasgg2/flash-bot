const { MessageEmbed } = require('discord.js');
const config = require('../config');
function embedBuilder(){
  return { color: config.EMBED_COLOR };
}

function successEmbed(title, desc){
  return { title, description: desc, color: config.EMBED_COLOR, timestamp: new Date().toISOString() };
}

function errorEmbed(title, desc){
  return { title, description: desc, color: 0xFF0000, timestamp: new Date().toISOString() };
}

module.exports = { embedBuilder, successEmbed, errorEmbed };
