const { createClient, registerHandlers } = require('./handlers/messageHandler');
const db = require('./database/database');
const logger = require('./logger');
const config = require('./config');

async function start(){
  try{
    db.init();
    const client = createClient();
    registerHandlers();
    const token = process.env.DISCORD_TOKEN;
    if(!token){
      logger.info('No DISCORD_TOKEN set; starting in dry-run mode (commands will not connect).');
      return;
    }
    client.login(token);
    process.on('SIGINT', async ()=>{ logger.info('Shutting down'); process.exit(0); });
  }catch(err){
    logger.error('Failed to start', err);
    process.exit(1);
  }
}

start();
