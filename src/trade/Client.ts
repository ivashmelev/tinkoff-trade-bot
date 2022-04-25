import { OpenAPIClient } from '@tinkoff/invest-js';

export const client = new OpenAPIClient({
  token: process.env.TOKEN as string,
});
