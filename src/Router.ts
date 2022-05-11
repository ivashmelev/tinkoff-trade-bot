import { OrdersService } from './trade/OrdersService';
import { SandboxService } from './trade/SandboxService';
import express from 'express';
import { log } from './trade/utils/log';

interface RouterConstructor {
  ordersService: OrdersService;
  sandboxService: SandboxService;
}

/**
 * Маршрутизатор бота
 */
export class Router {
  private ordersService: OrdersService;
  private sandboxService: SandboxService;

  constructor({ ordersService, sandboxService }: RouterConstructor) {
    this.ordersService = ordersService;
    this.sandboxService = sandboxService;
  }

  get order() {
    const router = express.Router();

    router.get('/post', async (request, response) => {
      try {
        const { direction, price, quantity } = request.query;
        response.send(await this.ordersService.postOrder(direction as 'BUY' | 'SELL', Number(price), Number(quantity)));
      } catch (error) {
        log(error);
      }
    });

    router.get('/cancel/:orderId', async (request, response) => {
      try {
        const { orderId } = request.params;
        response.send(await this.ordersService.cancelOrder(orderId));
      } catch (error) {
        log(error);
      }
    });

    router.get('/all', async (request, response) => {
      try {
        response.send(await this.ordersService.getActiveOrders());
      } catch (error) {
        log(error);
      }
    });

    return router;
  }

  get sandbox() {
    const router = express.Router();

    router.get('/openAccount', async (request, response) => {
      try {
        response.send(await this.sandboxService.openAccount());
      } catch (error) {
        log(error);
      }
    });

    router.get('/payIn/:accountId/:amount', async (request, response) => {
      try {
        const { amount, accountId } = request.params;
        response.send(await this.sandboxService.payIn(accountId, Number(amount)));
      } catch (error) {
        log(error);
      }
    });

    return router;
  }
}
