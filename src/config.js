module.exports = {
  DEFAULT_PREFIX: process.env.COMMAND_PREFIX || '!',
  EMBED_COLOR: process.env.EMBED_COLOR || '#5865F2',
  WHITELIST_OWNER_IDS: (process.env.WHITELIST_OWNER_IDS || '').split(',').map(s=>s.trim()).filter(Boolean),
  DATABASE_PATH: process.env.DATABASE_PATH || './data/bot.sqlite',
  ENABLE_DANGEROUS_OWNER_COMMANDS: (process.env.ENABLE_DANGEROUS_OWNER_COMMANDS || 'false') === 'true'
};
