import 'dotenv/config';
import express from 'express';
import { ExchangeSchedule } from './trade';
import { QuoteWatcher } from './trade/QuoteWatcher';

const app = express();

const port = 5000;

app.listen(port, async () => {
  const quoteWatcher = new QuoteWatcher();

  quoteWatcher.getLastPrice();
});
