import 'dotenv/config';
import express from 'express';
import { log } from './trade/utils/log';
import { SandboxService } from './trade/SandboxService';
import { Trade } from './trade/Trade';

const app = express();
const port = 5000;
const sandbox = new SandboxService();
const trade = new Trade();

app.use('/sandbox', sandbox?.apiRouter!);

app.listen(port, async () => {
  try {
    console.log('Bot is running!');
    await trade.start();
  } catch (error) {
    log(error);
  }
});
