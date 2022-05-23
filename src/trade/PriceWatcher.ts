import { client } from './Client';
import { parseMoneyValueToNumber } from './utils/parseMoneyValueToNumber';

const marketDataStream = client.marketDataStream.marketDataStream();

/**
 * Выдает котировки по figi (пока только usd)
 */
export class PriceWatcher {
  private price: number | null;

  constructor() {
    this.price = null;

    marketDataStream.write({
      subscribeLastPriceRequest: {
        subscriptionAction: 'SUBSCRIPTION_ACTION_SUBSCRIBE',
        instruments: [{ figi: process.env.USD_FIGI }],
      },
    });
  }

  on(callback: (price: number) => void) {
    marketDataStream.on('data', (value) => {
      if (value.payload === 'lastPrice') {
        const priceNumber = parseMoneyValueToNumber(value.lastPrice.price);
        callback(priceNumber);
      }
    });
  }
}
