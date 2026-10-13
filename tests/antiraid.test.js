const assert = require('assert');
const db = require('../src/database/database');

describe('Part 4: Antiraid and security DB', function () {
  before(function () {
    process.env.DATABASE_PATH = ':memory:';
    db.init();
  });

  it('can toggle antiraid settings', function () {
    db.setAntiraidSetting('g1', 'antiraid_on', 1);
    const s = db.getAntiraidSettings('g1');
    assert.strictEqual(s.antiraid_on, 1);
    db.setAntiraidSetting('g1', 'antiraid_on', 0);
    const s2 = db.getAntiraidSettings('g1');
    assert.strictEqual(s2.antiraid_on, 0);
  });

  it('can add and remove blacklist users', function () {
    db.addBlacklistUser('g1', 'u1', 'owner');
    assert.strictEqual(db.isUserBlacklisted('g1','u1'), true);
    db.removeBlacklistUser('g1','u1');
    assert.strictEqual(db.isUserBlacklisted('g1','u1'), false);
  });

  it('can add and list wordfilters', function () {
    db.addWordfilter('g1', 'badword', 'owner');
    const list = db.listWordfilters('g1');
    assert.ok(list.some(l=>l.word === 'badword'));
    db.removeWordfilter('g1', 'badword');
    const list2 = db.listWordfilters('g1');
    assert.ok(!list2.some(l=>l.word === 'badword'));
  });
});
