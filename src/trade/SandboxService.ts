import { OpenSandboxAccountResponse } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/OpenSandboxAccountResponse';
import { client } from './Client';
import { parseNumberToMoneyValue } from './utils/parseNumberToMoneyValue';
import express from 'express';
import { log } from './utils/log';

export class SandboxService {
  private openAccount(): Promise<OpenSandboxAccountResponse | undefined> {
    return new Promise((resolve, reject) => {
      client.sandbox.openSandboxAccount({}, (error, value) => {
        if (error) reject(error);

        resolve(value);
      });
    });
  }

  private payIn(accountId: string, amount: number) {
    return new Promise((resolve, reject) => {
      client.sandbox.sandboxPayIn({ accountId, amount: parseNumberToMoneyValue(amount) }, (error, value) => {
        if (error) reject(error);

        resolve(value);
      });
    });
  }

  get apiRouter() {
    const router = express.Router();

    router.get('/openAccount', async (request, response) => {
      try {
        response.send(await this.openAccount());
      } catch (error) {
        log(error);
      }
    });

    router.get('/payIn/:accountId/:amount', async (request, response) => {
      try {
        const { amount, accountId } = request.params;
        response.send(await this.payIn(accountId, Number(amount)));
      } catch (error) {
        log(error);
      }
    });

    return router;
  }
}
