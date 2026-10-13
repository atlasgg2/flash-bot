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

module.exports = { init, getDB, getGuildSettings, setGuildPrefix, getGuildPrefix };
