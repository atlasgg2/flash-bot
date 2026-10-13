const { PermissionsBitField } = require('discord.js');

function normalizePermissionName(name) {
  return String(name || '').trim();
}

function hasPermission(member, permissionName) {
  if (!member) return false;
  const name = normalizePermissionName(permissionName);
  if (!name) return true;

  if (name === 'Bot Owner') {
    return false;
  }

  if (typeof member.permissions?.has === 'function') {
    return member.permissions.has(name);
  }

  return false;
}

function hasBotPermission(guild, permissionName) {
  if (!guild || !guild.me) return false;
  const name = normalizePermissionName(permissionName);
  if (!name) return true;
  if (typeof guild.me.permissions?.has === 'function') {
    return guild.me.permissions.has(name);
  }
  return false;
}

function canModerateTarget(invokerMember, targetMember) {
  if (!invokerMember || !targetMember) return { ok: true };
  if (targetMember.id === invokerMember.id) {
    return { ok: false, reason: 'You cannot moderate yourself.' };
  }
  if (targetMember.id === targetMember.guild.ownerId) {
    return { ok: false, reason: 'You cannot moderate the server owner.' };
  }
  const invokerTop = invokerMember.roles.highest?.position ?? 0;
  const targetTop = targetMember.roles.highest?.position ?? 0;
  if (targetTop >= invokerTop) {
    return { ok: false, reason: 'You cannot moderate a member with an equal or higher role.' };
  }
  return { ok: true };
}

async function check(message, requiredUserPermission, requiredBotPermissions = [], options = {}) {
  if (!message || !message.member) {
    return { ok: false, reason: 'This command can only be used in a server.' };
  }

  if (requiredUserPermission && requiredUserPermission !== 'Everyone') {
    if (!hasPermission(message.member, requiredUserPermission)) {
      return { ok: false, reason: `You need the ${requiredUserPermission} permission to use this command.` };
    }
  }

  const targetMember = options.targetMember || null;
  if (targetMember) {
    const targetCheck = canModerateTarget(message.member, targetMember);
    if (!targetCheck.ok) {
      return { ok: false, reason: targetCheck.reason };
    }
  }

  const botPerms = Array.isArray(requiredBotPermissions) ? requiredBotPermissions : [requiredBotPermissions];
  for (const permission of botPerms) {
    if (!permission || !hasBotPermission(message.guild, permission)) {
      return { ok: false, reason: `I am missing the ${permission || 'required'} permission for this action.` };
    }
  }

  return { ok: true };
}

module.exports = { hasPermission, hasBotPermission, canModerateTarget, check };
