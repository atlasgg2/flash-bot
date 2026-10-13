const db = require('../database/database');

function isAntiraidEnabled(guildId){
  const s = db.getAntiraidSettings(guildId);
  return s && s.antiraid_on === 1;
}

module.exports = { isAntiraidEnabled };
