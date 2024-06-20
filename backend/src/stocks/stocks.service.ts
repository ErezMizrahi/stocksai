import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikedStocks } from './stock.entity';
import { AddLikedSymbolsDto } from './dtos/addLikedSymbolsDto.dto';
import { User } from 'src/users/user.entity';
import { Stock } from './types/stocks.type';
import { Bar } from './types/bar.type';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class StocksService {

    constructor(
        @Inject('ALPACA') private readonly alpaca, 
        private readonly configService: ConfigService,
        @InjectRepository(LikedStocks) private repo: Repository<LikedStocks>) {}

    async getSymbols(query: string) {
        try {
            const assets = await this.alpaca.getAssets({ status: 'active' });
            return assets
                .filter(asset => asset.name.toLowerCase().startsWith(query) || asset.symbol.toLowerCase().startsWith(query))
                .map(asset => {
                    return {
                        symbol: asset.symbol,
                        name: asset.name,
                    }
                });
        } catch (e) {
            console.error(e)
        }
       
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
        const existingUser = await this.repo.findOne({ where: {user: {id: userData.id}} });
        return existingUser;
    }

    private compareDatesWithoutTime(date1: string, date2: string): boolean {
        const date1WithoutTime = new Date(date1).setHours(0,0,0,0);
        const date2WithoutTime = new Date(date2).setHours(0,0,0,0);
        return date1WithoutTime < date2WithoutTime;
    }


    private async getLatestMarketDate() {
        const date = new Date();
        date.setDate(date.getDate() - 7);

        const tradingDays = await this.alpaca.getCalendar({
            start: date,
            end: new Date().toISOString()
        });
        const lastTradingDay = tradingDays.filter(day => this.compareDatesWithoutTime(day.date, new Date().toISOString()));

        return {
            latestMarketDate: lastTradingDay[lastTradingDay.length - 1].date
        }
        
    }

    async getMyStocksData(user: User) {
        const existingUser = await this.findUser(user);
        if(existingUser?.likedSymbols?.length < 1) { return []; }
        
        const { latestMarketDate } = await this.getLatestMarketDate();
        return this.getStocksData(existingUser.likedSymbols, latestMarketDate);
    }

   private async getStocksData(symbols: string[], latestMarketDate: string) {
        const barsMap: Map<string, Bar[]> = await this.alpaca.getMultiBarsV2(symbols, {
            start: latestMarketDate,
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
        
    }

    async getStockData(symbol: string, numberOfDays: number = 1) {
        const [ corporateData, stockData ] = await Promise.allSettled([ 
            this.getCorporateActions(symbol, numberOfDays),
            this.getSpesificStockData(symbol, numberOfDays)
         ]);

         return {
            stockData: stockData.status === 'fulfilled' ? stockData.value : [],
            corporateData: corporateData.status === 'fulfilled' ? corporateData.value : [],
         }
        

    }

    private async getSpesificStockData(symbol: string, numberOfDays: number) {
        const date = new Date();
        date.setDate(date.getDate() - numberOfDays);

        const yesterday = date.toISOString().split('T')[0];

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

        const from = date.toISOString().split('T')[0];
        
        const news = await this.alpaca.getNews({ 
            symbols: [symbol],
            start: from,
            end: new Date().toISOString().split('T')[0] + 'T06:00:00Z',
            sort: 'desc'
        })

        return news;
    }

   

    private async getCorporateActions(symbol: string, numberOfDays: number) {
        const endDateString = new Date().toISOString().split('T')[0];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - numberOfDays);
        const startDateString = startDate.toISOString().split('T')[0];

        const actions =  await fetch(`https://data.alpaca.markets/v1beta1/corporate-actions?symbols=${symbol}&start=${startDateString}&end=${endDateString}&limit=1000&sort=asc`, {
            headers: {
                'APCA-API-KEY-ID': this.configService.get<string>('ALPACA_KEY'),
                'APCA-API-SECRET-KEY': this.configService.get<string>('ALPACA_SECRET'),
            }
        });

        const json = await actions.json();

        if(json.corporate_actions.cash_dividends) {
            json.corporate_actions.cash_dividends = json.corporate_actions.cash_dividends.map(row => {
                return {
                    date: row.process_date,
                    rate: row.rate
                }
            })
        }

        if(json.corporate_actions.forward_splits) {
            json.corporate_actions.forward_splits = json.corporate_actions.forward_splits.map(row => {
                return {
                    date: row.process_date,
                    rate: `${row.old_rate} / ${row.new_rate}`
                }
            })
        }

        if(json.corporate_actions.cash_mergers) {
            json.corporate_actions.cash_mergers = json.corporate_actions.cash_mergers.map(row => {
                return {
                    date: row.process_date,
                    rate: row.rate,
                    accuired: row.acquiree_symbol
                }
            })
        }

        return json.corporate_actions;
    }
}
