const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { info } = require('../logger');
const config = require('../config');

function ensureDataDir() {
  const dir = path.dirname(config.DATABASE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

let db;
function init() {
  ensureDataDir();
  db = new Database(config.DATABASE_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS whitelist (
      guild_id TEXT PRIMARY KEY,
      granted_by TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER,
      lifetime INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS guild_settings (
      guild_id TEXT PRIMARY KEY,
      prefix TEXT,
      created_at INTEGER DEFAULT (strftime('%s','now')) * 1000
    );

    CREATE TABLE IF NOT EXISTS warnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      moderator_id TEXT NOT NULL,
      reason TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS temp_channels (
      guild_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      PRIMARY KEY (guild_id, channel_id)
    );

    CREATE TABLE IF NOT EXISTS temp_roles (
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      PRIMARY KEY (guild_id, user_id, role_id)
    );

    CREATE TABLE IF NOT EXISTS antiraid_settings (
      guild_id TEXT PRIMARY KEY,
      antiraid_on INTEGER DEFAULT 0,
      antispam_on INTEGER DEFAULT 0,
      antilink_on INTEGER DEFAULT 0,
      antiinvite_on INTEGER DEFAULT 0,
      antibot_on INTEGER DEFAULT 0,
      antiflood_on INTEGER DEFAULT 0,
      altcheck_days INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS blacklist_users (
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      added_by TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (guild_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS wordfilters (
      guild_id TEXT NOT NULL,
      word TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (guild_id, word)
    );
  `);
  info('Database initialized at', config.DATABASE_PATH);
}

function getDB() {
  if (!db) init();
  return db;
}

// Guild settings
function getGuildSettings(guildId) {
  const row = getDB().prepare('SELECT guild_id, prefix, created_at FROM guild_settings WHERE guild_id = ?').get(guildId);
  return row || null;
}

function setGuildPrefix(guildId, prefix) {
  const existing = getGuildSettings(guildId);
  if (existing) {
    getDB().prepare('UPDATE guild_settings SET prefix = ? WHERE guild_id = ?').run(prefix, guildId);
    return getGuildSettings(guildId);
  }
  getDB().prepare('INSERT INTO guild_settings (guild_id, prefix) VALUES (?, ?)').run(guildId, prefix);
  return getGuildSettings(guildId);
}

function getGuildPrefix(guildId) {
  const row = getGuildSettings(guildId);
  return row && row.prefix ? row.prefix : null;
}

// Warnings
function addWarning(guildId, userId, moderatorId, reason) {
  const createdAt = Date.now();
  const stmt = getDB().prepare(`
    INSERT INTO warnings (guild_id, user_id, moderator_id, reason, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(guildId, userId, moderatorId, reason || 'No reason provided', createdAt);
  return { id: result.lastInsertRowid, guild_id: guildId, user_id: userId, moderator_id: moderatorId, reason: reason || 'No reason provided', created_at: createdAt };
}

function getWarnings(guildId, userId) {
  return getDB().prepare(`
    SELECT id, guild_id, user_id, moderator_id, reason, created_at
    FROM warnings
    WHERE guild_id = ? AND user_id = ?
    ORDER BY created_at DESC
  `).all(guildId, userId);
}

// Temp channels
function addTempChannel(guildId, channelId, expiresAt) {
  return getDB().prepare('INSERT OR REPLACE INTO temp_channels (guild_id, channel_id, expires_at) VALUES (?, ?, ?)').run(guildId, channelId, expiresAt);
}

function getExpiredTempChannels(beforeTs) {
  return getDB().prepare('SELECT guild_id, channel_id FROM temp_channels WHERE expires_at <= ?').all(beforeTs);
}

function removeTempChannel(guildId, channelId) {
  return getDB().prepare('DELETE FROM temp_channels WHERE guild_id = ? AND channel_id = ?').run(guildId, channelId);
}

// Temp roles
function addTempRole(guildId, userId, roleId, expiresAt) {
  return getDB().prepare('INSERT OR REPLACE INTO temp_roles (guild_id, user_id, role_id, expires_at) VALUES (?, ?, ?, ?)').run(guildId, userId, roleId, expiresAt);
}

function getExpiredTempRoles(beforeTs) {
  return getDB().prepare('SELECT guild_id, user_id, role_id FROM temp_roles WHERE expires_at <= ?').all(beforeTs);
}

function removeTempRole(guildId, userId, roleId) {
  return getDB().prepare('DELETE FROM temp_roles WHERE guild_id = ? AND user_id = ? AND role_id = ?').run(guildId, userId, roleId);
}

// Antiraid settings
function setAntiraidSetting(guildId, key, value) {
  const allowed = ['antiraid_on','antispam_on','antilink_on','antiinvite_on','antibot_on','antiflood_on','altcheck_days'];
  if (!allowed.includes(key)) throw new Error('Invalid antiraid key');
  const exists = getDB().prepare('SELECT 1 FROM antiraid_settings WHERE guild_id = ?').get(guildId);
  if (!exists) {
    // insert defaults
    getDB().prepare(`INSERT INTO antiraid_settings (guild_id, antiraid_on, antispam_on, antilink_on, antiinvite_on, antibot_on, antiflood_on, altcheck_days) VALUES (?,0,0,0,0,0,0,0)`).run(guildId);
  }
  getDB().prepare(`UPDATE antiraid_settings SET ${key} = ? WHERE guild_id = ?`).run(value, guildId);
  return getAntiraidSettings(guildId);
}

function getAntiraidSettings(guildId) {
  return getDB().prepare('SELECT * FROM antiraid_settings WHERE guild_id = ?').get(guildId) || null;
}

// Blacklist
function addBlacklistUser(guildId, userId, addedBy) {
  const ts = Date.now();
  return getDB().prepare('INSERT OR REPLACE INTO blacklist_users (guild_id, user_id, added_by, created_at) VALUES (?, ?, ?, ?)').run(guildId, userId, addedBy, ts);
}

function removeBlacklistUser(guildId, userId) {
  return getDB().prepare('DELETE FROM blacklist_users WHERE guild_id = ? AND user_id = ?').run(guildId, userId);
}

function isUserBlacklisted(guildId, userId) {
  const row = getDB().prepare('SELECT 1 FROM blacklist_users WHERE guild_id = ? AND user_id = ?').get(guildId, userId);
  return !!row;
}

// Wordfilter
function addWordfilter(guildId, word, createdBy) {
  const ts = Date.now();
  return getDB().prepare('INSERT OR REPLACE INTO wordfilters (guild_id, word, created_by, created_at) VALUES (?, ?, ?, ?)').run(guildId, word.toLowerCase(), createdBy, ts);
}

function removeWordfilter(guildId, word) {
  return getDB().prepare('DELETE FROM wordfilters WHERE guild_id = ? AND word = ?').run(guildId, word.toLowerCase());
}

function listWordfilters(guildId) {
  return getDB().prepare('SELECT word, created_by, created_at FROM wordfilters WHERE guild_id = ? ORDER BY created_at DESC').all(guildId);
}

module.exports = {
  init,
  getDB,
  getGuildSettings,
  setGuildPrefix,
  getGuildPrefix,
  addWarning,
  getWarnings,
  addTempChannel,
  getExpiredTempChannels,
  removeTempChannel,
  addTempRole,
  getExpiredTempRoles,
  removeTempRole,
  setAntiraidSetting,
  getAntiraidSettings,
  addBlacklistUser,
  removeBlacklistUser,
  isUserBlacklisted,
  addWordfilter,
  removeWordfilter,
  listWordfilters
};
