import { client } from './Client';
import { parseMoneyValueToNumber } from './utils/parseMoneyValueToNumber';

export class AccountService {
  id: string;

  constructor(accountId: string) {
    this.id = accountId;
  }

  getBalance(): Promise<number> {
    return new Promise((resolve, reject) => {
      client.operations.getPositions({ accountId: this.id }, (error, value) => {
        if (error) reject(error);

        const currencyRub = value?.money.find(({ currency }) => currency === 'rub');

        resolve(parseMoneyValueToNumber(currencyRub!));
      });
    });
  }
}
