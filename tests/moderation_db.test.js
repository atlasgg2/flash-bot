const assert = require('assert');
const db = require('../src/database/database');

describe('moderation warnings DB', function () {
  before(function () {
    process.env.DATABASE_PATH = ':memory:';
    db.init();
  });

  it('adds and retrieves a warning', function () {
    const row = db.addWarning('g1', 'u1', 'mod1', 'Test reason');
    assert.ok(row.id);
    const warnings = db.getWarnings('g1', 'u1');
    assert.strictEqual(warnings.length, 1);
    assert.strictEqual(warnings[0].reason, 'Test reason');
  });
});
