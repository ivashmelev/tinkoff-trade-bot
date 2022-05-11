import { client } from './Client';
import { parseMoneyValueToNumber } from './utils/parseMoneyValueToNumber';

const marketDataStream = client.marketDataStream.marketDataStream();

/**
 * Выдает котировки по figi (пока только usd)
 */
export class PriceWatcher {
  price: number | null;

  constructor() {
    this.price = null;

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

  callback(callback: (price: number) => void) {
    marketDataStream.on('data', (value) => {
      if (value.payload === 'lastPrice') {
        callback(this.price!);
      }
    });
  }
}
