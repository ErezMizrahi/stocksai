import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { LikedStocks } from './stock.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksService } from './stocks.service';
import { AlpacaProvider } from './alpaca.provider';
import { HFProvider } from './huggingface.provider';
import { HFService } from './huggingface.service';

@Module({
    imports: [ TypeOrmModule.forFeature([ LikedStocks ])],
    controllers: [ StocksController ],
    providers: [ StocksService, HFService, AlpacaProvider, HFProvider],
    exports: [ TypeOrmModule ]
})
export class StocksModule {}
