module.exports = {
  name: 'ping',
  description: 'Latency check',
  usage: '!ping',
  permissions: { user: 'Everyone', bot: ['View Channels','Send Messages','Read Message History','Embed Links']},
  async execute(message){
    const t = Date.now();
    const reply = await message.reply('Pinging...');
    const latency = Date.now() - t;
    reply.edit({ content: `Pong! ${latency}ms` }).catch(()=>{});
  }
};
