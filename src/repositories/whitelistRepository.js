const dbModule = require('../database/database');
const ms = require('ms');

function addOrUpdateWhitelist(guildId, grantedBy, durationMs){
  const db = dbModule.getDB();
  const now = Date.now();
  let expiresAt = null;
  let lifetime = 0;
  if(durationMs == null){
    lifetime = 1;
  } else {
    expiresAt = now + durationMs;
  }
  const exists = db.prepare('SELECT 1 FROM whitelist WHERE guild_id = ?').get(guildId);
  if(exists){
    db.prepare('UPDATE whitelist SET granted_by = ?, created_at = ?, expires_at = ?, lifetime = ? WHERE guild_id = ?')
      .run(grantedBy, now, expiresAt, lifetime, guildId);
  } else {
    db.prepare('INSERT INTO whitelist (guild_id, granted_by, created_at, expires_at, lifetime) VALUES (?,?,?,?,?)')
      .run(guildId, grantedBy, now, expiresAt, lifetime);
  }
  return getWhitelist(guildId);
}

function removeWhitelist(guildId){
  const db = dbModule.getDB();
  const row = getWhitelist(guildId);
  db.prepare('DELETE FROM whitelist WHERE guild_id = ?').run(guildId);
  return row !== undefined;
}

function getWhitelist(guildId){
  const db = dbModule.getDB();
  const row = db.prepare('SELECT guild_id, granted_by, created_at, expires_at, lifetime FROM whitelist WHERE guild_id = ?').get(guildId);
  return row;
}

function isWhitelisted(guildId){
  const row = getWhitelist(guildId);
  if(!row) return false;
  if(row.lifetime) return true;
  if(row.expires_at && row.expires_at > Date.now()) return true;
  return false;
}

module.exports = { addOrUpdateWhitelist, removeWhitelist, getWhitelist, isWhitelisted };
