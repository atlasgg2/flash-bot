const { EmbedBuilder } = require('discord.js');

function sanitizeText(input, maxLen = 1900) {
  if (typeof input !== 'string') return '';
  return input.replace(/`/g, '\\`').slice(0, maxLen);
}

function isHexColor(value) {
  return /^#?[0-9A-Fa-f]{6}$/.test(String(value || ''));
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return ['http:', 'https:'].includes(u.protocol);
  } catch {
    return false;
  }
}

function parseDurationString(value) {
  if (!value || typeof value !== 'string') return null;
  const m = value.match(/^((?:\d+)(?:ms|s|m|h|d|w))$/i);
  if (!m) return null;
  const n = Number.parseInt(value, 10);
  const unit = value.replace(String(n), '').toLowerCase();
  const scales = { ms: 1, s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 };
  return scales[unit] ? n * scales[unit] : null;
}

function safeMoney(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

module.exports = { sanitizeText, isHexColor, isValidUrl, parseDurationString, safeMoney };
