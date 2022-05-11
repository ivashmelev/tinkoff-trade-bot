import { OrdersService } from './OrdersService';
import { PriceWatcher } from './PriceWatcher';
import { OrdersServiceSandbox } from './sandbox/OrdersServiceSandbox';
import { AccountService } from './AccountService';
import { AccountServiceSandbox } from './sandbox/AccountServiceSandbox';
import { isSandboxMode } from './sandbox/constants';

export class Trade {
  ordersService: OrdersService;
  priceWatcher: PriceWatcher;
  accountService: AccountService;

  constructor() {
    this.priceWatcher = new PriceWatcher();
    this.accountService = new AccountServiceSandbox(new AccountService(process.env.ACCOUNT_ID!));
    this.ordersService = new OrdersServiceSandbox(new OrdersService(this.accountService.id));
    console.log('isSandboxMode', isSandboxMode);
  }

  async start() {
    const balance = await this.accountService.getBalance();
    const orders = await this.ordersService.getActiveOrders();
    console.log(balance);
    console.log(orders);

    setInterval(() => {
      console.log(this.priceWatcher.price);
    }, 1000);
  }
}
