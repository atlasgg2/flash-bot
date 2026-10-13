const LOG_PREFIX = '[flash]';
function info(...args){ console.info(LOG_PREFIX, ...args); }
function warn(...args){ console.warn(LOG_PREFIX, ...args); }
function error(...args){ console.error(LOG_PREFIX, ...args); }
module.exports = { info, warn, error };
