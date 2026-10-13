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

    CREATE TABLE IF NOT EXISTS economy_accounts (
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      wallet INTEGER NOT NULL DEFAULT 0,
      bank INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (guild_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS economy_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS command_cooldowns (
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      command_name TEXT NOT NULL,
      until_epoch INTEGER NOT NULL,
      PRIMARY KEY (guild_id, user_id, command_name)
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      due_at INTEGER NOT NULL,
      sent INTEGER NOT NULL DEFAULT 0
    );
  `);
  info('Database initialized at', config.DATABASE_PATH);
}

function getDB() {
  if (!db) init();
  return db;
}

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

function addTempChannel(guildId, channelId, expiresAt) {
  return getDB().prepare('INSERT OR REPLACE INTO temp_channels (guild_id, channel_id, expires_at) VALUES (?, ?, ?)').run(guildId, channelId, expiresAt);
}

function getExpiredTempChannels(beforeTs) {
  return getDB().prepare('SELECT guild_id, channel_id FROM temp_channels WHERE expires_at <= ?').all(beforeTs);
}

function removeTempChannel(guildId, channelId) {
  return getDB().prepare('DELETE FROM temp_channels WHERE guild_id = ? AND channel_id = ?').run(guildId, channelId);
}

function addTempRole(guildId, userId, roleId, expiresAt) {
  return getDB().prepare('INSERT OR REPLACE INTO temp_roles (guild_id, user_id, role_id, expires_at) VALUES (?, ?, ?, ?)').run(guildId, userId, roleId, expiresAt);
}

function getExpiredTempRoles(beforeTs) {
  return getDB().prepare('SELECT guild_id, user_id, role_id FROM temp_roles WHERE expires_at <= ?').all(beforeTs);
}

function removeTempRole(guildId, userId, roleId) {
  return getDB().prepare('DELETE FROM temp_roles WHERE guild_id = ? AND user_id = ? AND role_id = ?').run(guildId, userId, roleId);
}

function setAntiraidSetting(guildId, key, value) {
  const allowed = ['antiraid_on','antispam_on','antilink_on','antiinvite_on','antibot_on','antiflood_on','altcheck_days'];
  if (!allowed.includes(key)) throw new Error('Invalid antiraid key');
  const exists = getDB().prepare('SELECT 1 FROM antiraid_settings WHERE guild_id = ?').get(guildId);
  if (!exists) {
    getDB().prepare(`INSERT INTO antiraid_settings (guild_id, antiraid_on, antispam_on, antilink_on, antiinvite_on, antibot_on, antiflood_on, altcheck_days) VALUES (?,0,0,0,0,0,0,0)`).run(guildId);
  }
  getDB().prepare(`UPDATE antiraid_settings SET ${key} = ? WHERE guild_id = ?`).run(value, guildId);
  return getAntiraidSettings(guildId);
}

function getAntiraidSettings(guildId) {
  return getDB().prepare('SELECT * FROM antiraid_settings WHERE guild_id = ?').get(guildId) || null;
}

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

function ensureEconomyAccount(guildId, userId) {
  const row = getDB().prepare('SELECT * FROM economy_accounts WHERE guild_id = ? AND user_id = ?').get(guildId, userId);
  if (row) return row;
  getDB().prepare('INSERT INTO economy_accounts (guild_id, user_id, wallet, bank) VALUES (?, ?, ?, ?)').run(guildId, userId, 0, 0);
  return getDB().prepare('SELECT * FROM economy_accounts WHERE guild_id = ? AND user_id = ?').get(guildId, userId);
}

function getEconomyAccount(guildId, userId) {
  return getDB().prepare('SELECT * FROM economy_accounts WHERE guild_id = ? AND user_id = ?').get(guildId, userId) || ensureEconomyAccount(guildId, userId);
}

function setEconomyAccount(guildId, userId, wallet, bank) {
  getDB().prepare('UPDATE economy_accounts SET wallet = ?, bank = ? WHERE guild_id = ? AND user_id = ?').run(wallet, bank, guildId, userId);
  return getEconomyAccount(guildId, userId);
}

function addTransaction(guildId, userId, type, amount, note = '') {
  getDB().prepare('INSERT INTO economy_transactions (guild_id, user_id, type, amount, created_at, note) VALUES (?, ?, ?, ?, ?, ?)')
    .run(guildId, userId, type, amount, Date.now(), note || '');
}

function setCooldown(guildId, userId, commandName, ms) {
  const until = Date.now() + ms;
  getDB().prepare('INSERT OR REPLACE INTO command_cooldowns (guild_id, user_id, command_name, until_epoch) VALUES (?, ?, ?, ?)')
    .run(guildId, userId, commandName, until);
}

function getCooldown(guildId, userId, commandName) {
  const row = getDB().prepare('SELECT until_epoch FROM command_cooldowns WHERE guild_id = ? AND user_id = ? AND command_name = ?').get(guildId, userId, commandName);
  if (!row) return 0;
  return row.until_epoch - Date.now();
}

function addReminder(guildId, userId, text, dueAt) {
  const result = getDB().prepare('INSERT INTO reminders (guild_id, user_id, text, created_at, due_at, sent) VALUES (?, ?, ?, ?, ?, 0)')
    .run(guildId, userId, text, Date.now(), dueAt);
  return { id: result.lastInsertRowid, guild_id: guildId, user_id: userId, text, due_at: dueAt };
}

function listRemindersForUser(guildId, userId) {
  return getDB().prepare('SELECT * FROM reminders WHERE guild_id = ? AND user_id = ? AND sent = 0 ORDER BY due_at ASC').all(guildId, userId);
}

function deleteReminder(id) {
  return getDB().prepare('DELETE FROM reminders WHERE id = ?').run(id);
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
  listWordfilters,
  ensureEconomyAccount,
  getEconomyAccount,
  setEconomyAccount,
  addTransaction,
  setCooldown,
  getCooldown,
  addReminder,
  listRemindersForUser,
  deleteReminder
};
