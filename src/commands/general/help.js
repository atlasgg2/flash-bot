const { loadCommands } = require('../../handlers/commandHandler');

module.exports = {
  name: 'help',
  description: 'Shows help',
  usage: '!help [page]',
  permissions: { user: 'Everyone', bot: ['View Channels','Send Messages','Embed Links']},
  async execute(message, args, { commands }){
    // commands is a Map loaded in the handler; but we can reload here
    const all = loadCommands();
    // filter hidden
    const visible = Array.from(all.values()).filter(c=>!c.hidden);
    const page = Math.max(1, parseInt(args[0]) || 1);
    const per = 10;
    const start = (page-1)*per;
    const chunk = visible.slice(start, start+per);
    const lines = chunk.map(c=>`**${c.name}** - ${c.description || ''}`);
    message.reply({ embeds: [ { title: `Help - page ${page}`, description: lines.join('\n') || 'No commands', color: 0x5865F2 } ] }).catch(()=>{});
  }
};
