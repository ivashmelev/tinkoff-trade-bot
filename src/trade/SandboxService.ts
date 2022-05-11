import { OpenSandboxAccountResponse } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/OpenSandboxAccountResponse';
import { client } from './Client';
import { parseNumberToMoneyValue } from './utils/parseNumberToMoneyValue';

export class SandboxService {
  openAccount(): Promise<OpenSandboxAccountResponse | undefined> {
    return new Promise((resolve, reject) => {
      client.sandbox.openSandboxAccount({}, (error, value) => {
        if (error) reject(error);

        resolve(value);
      });
    });
  }

  payIn(accountId: string, amount: number) {
    return new Promise((resolve, reject) => {
      client.sandbox.sandboxPayIn({ accountId, amount: parseNumberToMoneyValue(amount) }, (error, value) => {
        if (error) reject(error);

        resolve(value);
      });
    });
  }
}
