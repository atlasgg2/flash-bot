const assert = require('assert');
const db = require('../src/database/database');

describe('Economy basics', function () {
  before(function () {
    process.env.DATABASE_PATH = ':memory:';
    db.init();
  });

  it('creates a zero-balance economy account', function () {
    const account = db.ensureEconomyAccount('g1', 'u1');
    assert.strictEqual(account.wallet, 0);
    assert.strictEqual(account.bank, 0);
  });

  it('adds and tracks wallet balance', function () {
    db.setEconomyAccount('g1', 'u1', 250, 0);
    const account = db.getEconomyAccount('g1', 'u1');
    assert.strictEqual(account.wallet, 250);
  });

  it('supports cooldown values', function () {
    db.setCooldown('g1', 'u1', 'daily', 60000);
    const remaining = db.getCooldown('g1', 'u1', 'daily');
    assert.ok(remaining > 0);
  });

  it('can add a reminder', function () {
    const row = db.addReminder('g1', 'u1', 'Test reminder', Date.now() + 5000);
    assert.ok(row.id);
  });
});
