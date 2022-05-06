import 'dotenv/config';
import express from 'express';
import { SandboxService } from './trade/SandboxService';
import { log } from './trade/utils/log';

const app = express();
const port = 5000;

let sandbox = process.env.SANDBOX_MODE === '1' ? new SandboxService() : null;

app.get('/openAccount', async (request, response) => {
  try {
    response.send(await sandbox?.openAccount());
  } catch (error) {
    log(error);
  }
});

app.get('/payIn/:accountId/:amount', async (request, response) => {
  try {
    const { accountId, amount } = request.params;
    response.send(await sandbox?.payIn(accountId, Number(amount)));
  } catch (error) {
    log(error);
  }
});

app.listen(port, async () => {
  try {
    console.log('Bot is running!');
  } catch (error) {
    log(error);
  }
});
