import { MoneyValue } from '@tinkoff/invest-js/build/generated/tinkoff/public/invest/api/contract/v1/MoneyValue';

export const parseMoneyValueToNumber = (value: MoneyValue) => {
  const { units, nano } = value;

  return Number(`${units}.${nano}`);
};
