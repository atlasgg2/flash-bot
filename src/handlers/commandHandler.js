const fs = require('fs');
const path = require('path');

function loadCommands(startDir = path.join(__dirname, '..', 'commands')) {
  const commands = new Map();

  function walk(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!entry.name.endsWith('.js')) continue;

      let command;
      try {
        command = require(fullPath);
      } catch (error) {
        console.warn(`Skipping command file ${fullPath}: ${error.message}`);
        continue;
      }

      if (!command || typeof command !== 'object' || !command.name) continue;

      commands.set(String(command.name).toLowerCase(), command);

      if (Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
          commands.set(String(alias).toLowerCase(), command);
        }
      }
    }
  }

  walk(startDir);
  return commands;
}

module.exports = { loadCommands };
