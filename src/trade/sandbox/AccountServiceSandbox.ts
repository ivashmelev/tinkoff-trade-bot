import { AccountService } from '../AccountService';
import { isSandboxMode } from './constants';
import { client } from '../Client';
import { parseMoneyValueToNumber } from '../utils/parseMoneyValueToNumber';

export class AccountServiceSandbox implements AccountService {
  accountService: AccountService;
  id: string;

  constructor(accountService: AccountService) {
    this.accountService = accountService;
    this.id = accountService.id;
  }

  getBalance(): Promise<number> {
    if (isSandboxMode) {
      return new Promise((resolve, reject) => {
        client.sandbox.getSandboxPositions({ accountId: this.id }, (error, value) => {
          if (error) reject(error);

          const currencyRub = value?.money.find(({ currency }) => currency === 'rub');

          resolve(parseMoneyValueToNumber(currencyRub!));
        });
      });
    } else {
      return this.accountService.getBalance();
    }
  }
}
