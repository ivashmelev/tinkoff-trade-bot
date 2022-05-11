import 'dotenv/config';
import express from 'express';
import { log } from './trade/utils/log';
import { SandboxService } from './trade/SandboxService';
import { Trade } from './trade/Trade';
import { Router } from './Router';

const app = express();
const port = 5000;
const trade = new Trade();
const sandboxService = new SandboxService();
const { ordersService } = trade;
const router = new Router({ ordersService, sandboxService });

app.use('/order', router.order);
app.use('/sandbox', router.sandbox);

app.listen(port, async () => {
  try {
    console.log('Bot is running!');
    await trade.start();
  } catch (error) {
    log(error);
  }
});
