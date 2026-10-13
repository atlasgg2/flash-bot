const { safeMoney } = require('../../utils/validators');
const { setCooldown, getCooldown } = require('../../services/economy/economyRepo');

function hasReachedCooldown(guildId, userId, commandName, durationMs) {
  const remaining = getCooldown(guildId, userId, commandName);
  if (remaining > 0) return { ok: false, remaining };
  setCooldown(guildId, userId, commandName, durationMs);
  return { ok: true };
}

module.exports = { hasReachedCooldown };
