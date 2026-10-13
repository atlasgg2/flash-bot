const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { info, error } = require('../logger');
const config = require('../config');

function ensureDataDir(){
  const dir = path.dirname(config.DATABASE_PATH);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

let db;
function init(){
  ensureDataDir();
  db = new Database(config.DATABASE_PATH);
  // migrations
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
      prefix TEXT
    );
  `);
  info('Database initialized at', config.DATABASE_PATH);
}

function getDB(){
  if(!db) init();
  return db;
}

module.exports = { init, getDB };
