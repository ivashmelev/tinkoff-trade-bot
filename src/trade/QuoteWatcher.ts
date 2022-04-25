import { client } from './Client';
import { parseMoneyValueToNumber } from './utils/parseMoneyValueToNumber';

/**
 * Выдает котировки по figi (пока только usd)
 */
export class QuoteWatcher {
  price: number | null;

  constructor() {
    this.price = null;

    const marketDataStream = client.marketDataStream.marketDataStream();

    marketDataStream.write({
      subscribeLastPriceRequest: {
        subscriptionAction: 'SUBSCRIPTION_ACTION_SUBSCRIBE',
        instruments: [{ figi: process.env.USD_FIGI }],
      },
    });

    marketDataStream.on('data', (value) => {
      if (value.payload === 'lastPrice') {
        const { lastPrice } = value;

        this.price = parseMoneyValueToNumber(lastPrice.price);
      }
    });
  }
}
