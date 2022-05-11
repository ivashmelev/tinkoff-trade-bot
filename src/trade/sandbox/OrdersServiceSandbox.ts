import { OrdersService } from '../OrdersService';
import { PostOrderResponse } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/PostOrderResponse';
import { isSandboxMode } from './constants';
import { client } from '../Client';
import { nanoid } from 'nanoid';
import { parseNumberToMoneyValue } from '../utils/parseNumberToMoneyValue';
import { CancelOrderResponse } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/CancelOrderResponse';
import { OrderState } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/OrderState';
import { AccountService } from '../AccountService';

export class OrdersServiceSandbox implements OrdersService {
  ordersService: OrdersService;
  accountId: AccountService['id'];

  constructor(ordersService: OrdersService) {
    this.ordersService = ordersService;
    this.accountId = ordersService.accountId;
  }

  postOrder(direction: 'BUY' | 'SELL', price: number, quantity: number): Promise<PostOrderResponse | undefined> {
    if (isSandboxMode) {
      return new Promise((resolve, reject) => {
        client.sandbox.postSandboxOrder(
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
    } else {
      return this.ordersService.postOrder(direction, price, quantity);
    }
  }

  cancelOrder(orderId: string): Promise<CancelOrderResponse | undefined> {
    if (isSandboxMode) {
      return new Promise((resolve, reject) => {
        client.sandbox.cancelSandboxOrder({ orderId }, (error, value) => {
          if (error) reject(error);

          resolve(value);
        });
      });
    } else {
      return this.ordersService.cancelOrder(orderId);
    }
  }

  getActiveOrders(): Promise<OrderState[]> {
    if (isSandboxMode) {
      return new Promise((resolve, reject) => {
        client.sandbox.getSandboxOrders({ accountId: this.accountId }, (error, value) => {
          if (error) reject(error);

          resolve(value?.orders || []);
        });
      });
    } else {
      return this.ordersService.getActiveOrders();
    }
  }
}
