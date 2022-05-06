import { client } from './Client';
import { nanoid } from 'nanoid';
import { parseNumberToMoneyValue } from './utils/parseNumberToMoneyValue';
import { PostOrderResponse } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/PostOrderResponse';
import { log } from './utils/log';
import { CancelOrderResponse } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/CancelOrderResponse';
import { PostOrderRequest } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/PostOrderRequest';

/**
 * Сервис по обслуживанию функционала торговых поручений (пока только для USD)
 */
export class OrdersService {
  constructor() {
    const ordersStream = client.ordersStream.tradesStream({});

    ordersStream.on('data', (value) => {
      log(value);
    });
  }

  postOrder(direction: 'BUY' | 'SELL', price: number, quantity: number): Promise<PostOrderResponse | undefined> {
    return new Promise((resolve, reject) => {
      const argument: PostOrderRequest = {
        orderId: nanoid(),
        orderType: 'ORDER_TYPE_LIMIT',
        figi: process.env.USD_FIGI,
        price: parseNumberToMoneyValue(price),
        direction: direction === 'BUY' ? 'ORDER_DIRECTION_BUY' : 'ORDER_DIRECTION_SELL',
        quantity,
        accountId: process.env.ACCOUNT_ID,
      };

      if (process.env.SANDBOX_MODE === '1') {
        client.sandbox.postSandboxOrder(argument, (error, value) => {
          if (error) reject(error);

          resolve(value);
        });
      } else {
        client.orders.postOrder(argument, (error, value) => {
          if (error) reject(error);

          resolve(value);
        });
      }
    });
  }

  cancelOrder(orderId: string): Promise<CancelOrderResponse | undefined> {
    return new Promise((resolve, reject) => {
      if (process.env.SANDBOX_MODE === '1') {
        client.sandbox.cancelSandboxOrder({ orderId }, (error, value) => {
          if (error) reject(error);

          resolve(value);
        });
      } else {
        client.orders.cancelOrder({ orderId }, (error, value) => {
          if (error) reject(error);

          resolve(value);
        });
      }
    });
  }
}
