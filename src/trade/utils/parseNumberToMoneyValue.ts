import { MoneyValue } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/MoneyValue';

export const parseNumberToMoneyValue = (value: number): MoneyValue => {
  return {
    units: String(Math.trunc(value)),
    get nano() {
      return Number(value.toPrecision(11).toString().replace(`${this.units}.`, ''));
    },
  };
};
