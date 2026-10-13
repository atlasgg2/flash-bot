const db = require('../database/database');

function ensureAccount(guildId, userId) {
  return db.ensureEconomyAccount(guildId, userId);
}

function getBalance(guildId, userId) {
  const acc = ensureAccount(guildId, userId);
  return { wallet: Number(acc.wallet || 0), bank: Number(acc.bank || 0), total: Number((acc.wallet || 0) + (acc.bank || 0)) };
}

function addToWallet(guildId, userId, amount, note = '') {
  const acc = ensureAccount(guildId, userId);
  const next = Number(acc.wallet || 0) + Number(amount || 0);
  db.setEconomyAccount(guildId, userId, next, Number(acc.bank || 0));
  db.addTransaction(guildId, userId, 'wallet_add', Number(amount || 0), note || 'wallet_add');
  return getBalance(guildId, userId);
}

function removeFromWallet(guildId, userId, amount, note = '') {
  const acc = ensureAccount(guildId, userId);
  const next = Math.max(0, Number(acc.wallet || 0) - Number(amount || 0));
  db.setEconomyAccount(guildId, userId, next, Number(acc.bank || 0));
  db.addTransaction(guildId, userId, 'wallet_remove', -Number(amount || 0), note || 'wallet_remove');
  return getBalance(guildId, userId);
}

function transferMoney(guildId, fromUserId, toUserId, amount, note = '') {
  const from = ensureAccount(guildId, fromUserId);
  const to = ensureAccount(guildId, toUserId);
  if (Number(from.wallet || 0) < Number(amount || 0)) return { ok: false, reason: 'Insufficient funds.' };
  const fromNext = Number(from.wallet || 0) - Number(amount || 0);
  const toNext = Number(to.wallet || 0) + Number(amount || 0);
  db.setEconomyAccount(guildId, fromUserId, fromNext, Number(from.bank || 0));
  db.setEconomyAccount(guildId, toUserId, toNext, Number(to.bank || 0));
  db.addTransaction(guildId, fromUserId, 'pay_out', -Number(amount || 0), note || 'transfer_out');
  db.addTransaction(guildId, toUserId, 'pay_in', Number(amount || 0), note || 'transfer_in');
  return { ok: true, from: getBalance(guildId, fromUserId), to: getBalance(guildId, toUserId) };
}

function setCooldown(guildId, userId, commandName, ms) {
  db.setCooldown(guildId, userId, commandName, ms);
}

function getCooldown(guildId, userId, commandName) {
  return db.getCooldown(guildId, userId, commandName);
}

module.exports = { ensureAccount, getBalance, addToWallet, removeFromWallet, transferMoney, setCooldown, getCooldown };
