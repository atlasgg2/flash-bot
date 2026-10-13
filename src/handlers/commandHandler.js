const fs = require('fs');
const path = require('path');

function loadCommands(){
  const commands = new Map();
  const commandsDir = path.join(__dirname, '..', 'commands');
  if(!fs.existsSync(commandsDir)) return commands;
  const categories = fs.readdirSync(commandsDir);
  for(const cat of categories){
    const catPath = path.join(commandsDir, cat);
    if(!fs.statSync(catPath).isDirectory()) continue;
    const files = fs.readdirSync(catPath).filter(f=>f.endsWith('.js'));
    for(const file of files){
      const cmd = require(path.join(catPath, file));
      if(cmd && cmd.name) commands.set(cmd.name, cmd);
      if(cmd && cmd.aliases) cmd.aliases.forEach(a=>commands.set(a, cmd));
    }
  }
  return commands;
}

module.exports = { loadCommands };
