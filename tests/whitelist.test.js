const whitelistRepo = require('../../src/repositories/whitelistRepository');
const db = require('../../src/database/database');
const assert = require('assert');

describe('Whitelist repository', function(){
  before(function(){
    process.env.DATABASE_PATH = ':memory:';
    db.init();
  });

  it('allows adding a lifetime whitelist', function(){
    const row = whitelistRepo.addOrUpdateWhitelist('1001', '2001', null);
    assert.strictEqual(row.guild_id, '1001');
    assert.strictEqual(row.granted_by, '2001');
    assert.strictEqual(row.lifetime, 1);
  });

  it('allows adding a temporary whitelist', function(){
    const ms = require('ms');
    const tenMin = ms('10m');
    const row = whitelistRepo.addOrUpdateWhitelist('1002', '2001', tenMin);
    assert.strictEqual(row.guild_id, '1002');
    assert.strictEqual(row.granted_by, '2001');
    assert.strictEqual(row.lifetime, 0);
    const fetched = whitelistRepo.getWhitelist('1002');
    assert.ok(fetched.expires_at > Date.now());
  });

  it('removes whitelist', function(){
    whitelistRepo.addOrUpdateWhitelist('1003','2001', null);
    const removed = whitelistRepo.removeWhitelist('1003');
    assert.strictEqual(removed, true);
    const fetched = whitelistRepo.getWhitelist('1003');
    assert.strictEqual(fetched, undefined);
  });
});
