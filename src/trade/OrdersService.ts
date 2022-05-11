import { client } from './Client';
import { nanoid } from 'nanoid';
import { parseNumberToMoneyValue } from './utils/parseNumberToMoneyValue';
import { PostOrderResponse } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/PostOrderResponse';
import { CancelOrderResponse } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/CancelOrderResponse';
import { OrderState } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/OrderState';
import { AccountService } from './AccountService';

/**
 * Сервис по обслуживанию функционала торговых поручений (пока только для USD)
 */
export class OrdersService {
  readonly accountId: AccountService['id'];

  constructor(accountId: AccountService['id']) {
    this.accountId = accountId;
  }

  postOrder(direction: 'BUY' | 'SELL', price: number, quantity: number): Promise<PostOrderResponse | undefined> {
    return new Promise((resolve, reject) => {
      client.orders.postOrder(
        {
          orderId: nanoid(),
          orderType: 'ORDER_TYPE_LIMIT',
          figi: process.env.USD_FIGI,
          price: parseNumberToMoneyValue(price),
          direction: direction === 'BUY' ? 'ORDER_DIRECTION_BUY' : 'ORDER_DIRECTION_SELL',
          quantity,
          accountId: this.accountId,
        },
        (error, value) => {
          if (error) reject(error);

          resolve(value);
        }
      );
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

  getActiveOrders(): Promise<OrderState[]> {
    return new Promise((resolve, reject) => {
      if (process.env.SANDBOX_MODE === '1') {
        client.sandbox.getSandboxOrders({ accountId: this.accountId }, (error, value) => {
          if (error) reject(error);

          resolve(value?.orders || []);
        });
      } else {
        client.orders.getOrders({ accountId: this.accountId }, (error, value) => {
          if (error) reject(error);

          resolve(value?.orders || []);
        });
      }
    });
  }
}
