import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikedStocks } from './stock.entity';
import { AddLikedSymbolsDto } from './dtos/addLikedSymbolsDto.dto';
import { User } from 'src/users/user.entity';

export interface Stock {
    symbol: string;
    open: number;
    close: number;
    timestamp: string;
    percent: string;
}

interface Bar {
    Symbol: string;
    ClosePrice: number;
    HighPrice: number;
    LowPrice: number;
    TradeCount: number;
    OpenPrice: number;
    Timestamp: string;
    Volume: number;
    VWAP: number;
}

@Injectable()
export class StocksService {

    constructor(
        @Inject('ALPACA') private readonly alpaca, 
        @InjectRepository(LikedStocks) private repo: Repository<LikedStocks>) {}

    async getSymbols(query: string) {
        const assets = await this.alpaca.getAssets({ status: 'active' });
        return assets
            .filter(asset => asset.name.toLowerCase().startsWith(query) || asset.symbol.toLowerCase().startsWith(query))
            .map(asset => {
                console.log(asset)
                return {
                    symbol: asset.symbol,
                    name: asset.name,
                }
            });
    }

    async addLikedSymbols(dto: AddLikedSymbolsDto, user: User) {
        const existingUserSymbols = await this.findUser(user);

        if(existingUserSymbols) {
            existingUserSymbols.likedSymbols = dto.likedSymbols;
            return this.repo.save(existingUserSymbols)
        } else {
            const likedSymbol = this.repo.create({likedSymbols: dto.likedSymbols});
            likedSymbol.user = user;
            return this.repo.save(likedSymbol);
        }
        
       
    }

    async findUser(userData: Partial<User>) {
        console.log('userdata', userData)
        const existingUser = await this.repo.findOne({ where: {user: {id: userData.id}} });
        console.log('existingUser', existingUser)

        return existingUser;
    }


    private async getMarketHours() {
        const res = await this.alpaca.getClock();
        return {
            isOpen: res.is_open,
            nextOpen: res.next_open
        }
        
    }

    private getOpenDay(date: Date): number {
        const dayOfTheWeek: number = date.getDay();
        if (dayOfTheWeek === 0) { // Sunday
            return 2; // Move back to Friday
        } else if (dayOfTheWeek === 1) { // Monday
            return 3; // Move back to Friday
        } else if (dayOfTheWeek > 1 && dayOfTheWeek <= 5) { // Tuesday to Friday
            return 1; // Move back to the previous day
        } else if (dayOfTheWeek === 6) { // Saturday
            return 1; // Move back to Friday
        }
    }

    async getMyStocksData(user: User) {
        const existingUserSymbols = await this.findUser(user);
        const { isOpen, nextOpen } = await this.getMarketHours();
        let days = 0;
        const date = new Date();

        if(!isOpen) {
            days = this.getOpenDay(date);
        }

        date.setDate(date.getDate() - days);
        const yesterday = date.toISOString().split('T')[0];
        console.log('yesterday', yesterday, 'days', days, isOpen)

        const barsMap: Map<string, Bar[]> = await this.alpaca.getMultiBarsV2(existingUserSymbols.likedSymbols, {
            start: yesterday,
            end: new Date().toISOString().split('T')[0] + 'T06:00:00Z',
            timeframe: '1day',
            limit: '1000',
          });

          const stocks: Stock[] = [];
          for await (let [key, value] of barsMap) {
            this.procceesStock(stocks, key, value);
          }

        return stocks;
    }

   
    
    async getHistory(symbol: string, numberOfDays: number = 1) {
        const date = new Date();
        date.setDate(date.getDate() - numberOfDays);

        const yesterday = date.toISOString().split('T')[0];
        console.log(yesterday)

        const barsMap: Bar[] = await this.alpaca.getBarsV2(symbol, {
            start: yesterday,
            end: new Date().toISOString().split('T')[0] + 'T06:00:00Z',
            timeframe: '1day',
            limit: '1000',
          });

          const stocks: Stock[] = [];
          for await (let bar of barsMap) {
            this.procceesStock(stocks, symbol, bar);
          }

        return stocks;
    }

    private procceesStock(stocks: Stock[], symbol: string, value: Bar | Bar[]) {
        // const stocks: Stock[] = [];

        // for (let [key, value] of barsMap) {
            let latestValue: Bar = null;
            if(Array.isArray(value)) {
                latestValue = this.getBarLatestByTimestamp(value);
            } else {
                latestValue = value;
            }

            const diff = latestValue.ClosePrice - latestValue.OpenPrice;
            const changePercent = (diff / latestValue.ClosePrice * 100).toPrecision(1);

            const stock: Stock = {
                symbol,
                open: latestValue.OpenPrice,
                close: latestValue.ClosePrice,
                timestamp: latestValue.Timestamp.split('T')[0],
                percent: changePercent
            };
            stocks.push(stock);
        // }
    
        return stocks;
    }
    
    private getBarLatestByTimestamp(value: Bar[]) {
        return value.reduce((acc, cur) => {
            const curTimestamp = new Date(cur.Timestamp).getTime()
            const accTimestamp = new Date(acc.Timestamp).getTime()
            if(curTimestamp > accTimestamp) {
                return cur;
            }

            return acc;
        }, value[0]);
    }


    async getNewsHistory(symbol: string, numberOfDays: number = 1) {
        const date = new Date();
        date.setDate(date.getDate() - numberOfDays);

        const yesterday = date.toISOString().split('T')[0];
        
        const news = await this.alpaca.getNews({ 
            symbols: [symbol],
            start: yesterday,
            end: new Date().toISOString().split('T')[0] + 'T06:00:00Z',
            sort: 'desc'
        })

        console.log(news);

        return news;
    }
}
