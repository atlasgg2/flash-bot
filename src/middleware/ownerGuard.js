const { WHITELIST_OWNER_IDS } = require('../config');

function isOwner(userId){
  return WHITELIST_OWNER_IDS.includes(String(userId));
}

module.exports = { isOwner };
