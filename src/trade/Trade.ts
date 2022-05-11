import { OrdersService } from './OrdersService';
import { PriceWatcher } from './PriceWatcher';
import { OrdersServiceSandbox } from './sandbox/OrdersServiceSandbox';
import { AccountService } from './AccountService';
import { AccountServiceSandbox } from './sandbox/AccountServiceSandbox';
import { client } from './Client';
import { log } from './utils/log';

export class Trade {
  ordersService: OrdersService;
  priceWatcher: PriceWatcher;
  accountService: AccountService;

  constructor() {
    this.priceWatcher = new PriceWatcher();
    this.accountService = new AccountServiceSandbox(new AccountService(process.env.ACCOUNT_ID!));
    this.ordersService = new OrdersServiceSandbox(new OrdersService(this.accountService.id));
  }

  async start() {
    const balance = await this.accountService.getBalance();
    const orders = await this.ordersService.getActiveOrders();

    // Здесь логика торговли
    const threshold = {
      takeProfit: 1,
      stopLoss: 2,
    };

    const ratioValue = 0.1;

    this.priceWatcher.callback((price) => {
      const takeProfit = price * (1 + (ratioValue * threshold.takeProfit) / 100);
      const stopLoss = price * (1 - (ratioValue * threshold.stopLoss) / 100);
    });

    const tradesStream = client.ordersStream.tradesStream({});

    tradesStream.on('data', (data) => {
      log(data);
    });
  }
}
