const assert = require('assert');
const { loadCommands } = require('../src/handlers/commandHandler');
const db = require('../src/database/database');

describe('Part 1: general command setup', function () {
  it('help does not expose hidden whitelist commands', function () {
    const commands = loadCommands();
    const vis = Array.from(commands.values()).filter(c => !c.hidden).map(c => c.name);
    assert.ok(!vis.includes('whitelist'));
    assert.ok(!vis.includes('whitelist-remove'));
  });

  it('general commands metadata is registered', function () {
    const commands = loadCommands();
    const expected = ['ping', 'uptime', 'botinfo', 'serverinfo', 'userinfo', 'avatar', 'banner', 'roles', 'emojis', 'stickers', 'boosts', 'invite', 'support', 'vote', 'stats', 'credits', 'changelog', 'terms', 'privacy', 'membercount'];
    for (const name of expected) {
      assert.ok(commands.has(name), `missing ${name}`);
    }
  });

  it('guild prefix can be set and retrieved', function () {
    process.env.DATABASE_PATH = ':memory:';
    db.init();
    db.setGuildPrefix('guild-123', '?');
    assert.strictEqual(db.getGuildPrefix('guild-123'), '?');
  });
});
