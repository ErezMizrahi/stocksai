import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const Alpaca = require('@alpacahq/alpaca-trade-api');
// import { createClient } from "@alpacahq/typescript-sdk";

export const AlpacaProvider: Provider = {
  provide: 'ALPACA',
  useFactory: (configService: ConfigService) => {
    return new Alpaca({
      keyId: configService.get<string>('ALPACA_KEY'),
      secretKey: configService.get<string>('ALPACA_SECRET'),
      paper: true
    });
  },
  inject: [ConfigService]
};
