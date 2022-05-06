import { client } from './Client';
import { OpenSandboxAccountResponse } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/OpenSandboxAccountResponse';
import { parseNumberToMoneyValue } from './utils/parseNumberToMoneyValue';
import { parseMoneyValueToNumber } from './utils/parseMoneyValueToNumber';

export class SandboxService {
  constructor() {
    client.sandbox.getSandboxPortfolio({ accountId: process.env.ACCOUNT_ID }, (error, value) => {
      if (error) throw error;

      console.log(
        'Current balance: ',
        value?.totalAmountCurrencies && parseMoneyValueToNumber(value.totalAmountCurrencies)
      );
    });
  }

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
