const assert = require('assert');
const pg = require('../src/middleware/permissionGuard');

describe('permissionGuard', function () {
  it('prevents moderating self', function () {
    const guild = { ownerId: 'owner', id: 'g1' };
    const me = { id: 'u1', roles: { highest: { position: 2 } } };
    const target = { id: 'u1', roles: { highest: { position: 1 } }, guild };
    const res = pg.canModerateTarget(me, target);
    assert.strictEqual(res.ok, false);
  });

  it('prevents moderating owner', function () {
    const guild = { ownerId: 'owner', id: 'g1' };
    const me = { id: 'u2', roles: { highest: { position: 10 } } };
    const target = { id: 'owner', roles: { highest: { position: 100 } }, guild };
    const res = pg.canModerateTarget(me, target);
    assert.strictEqual(res.ok, false);
  });

  it('prevents moderating equal/higher role', function () {
    const guild = { ownerId: 'owner', id: 'g1' };
    const me = { id: 'u2', roles: { highest: { position: 5 } } };
    const target = { id: 'u3', roles: { highest: { position: 5 } }, guild };
    const res = pg.canModerateTarget(me, target);
    assert.strictEqual(res.ok, false);
  });

  it('allows moderating lower role', function () {
    const guild = { ownerId: 'owner', id: 'g1' };
    const me = { id: 'u2', roles: { highest: { position: 10 } } };
    const target = { id: 'u3', roles: { highest: { position: 5 } }, guild };
    const res = pg.canModerateTarget(me, target);
    assert.strictEqual(res.ok, true);
  });
});
