import { Bar, HistoryBars } from "../types/history.bars";
import { Stock } from "../types/stock";
import { ENDPOINTS } from "../utils/constants";
import { AlpacaApi } from "./alpaca";

class StockPricing extends AlpacaApi {
    defaultParameters: Record<string, any> = {
        adjustment: 'raw',
        feed: 'sip',
        sort: 'asc'
    }

    endpoint: string = ENDPOINTS.STOCK_PRICE_BARS_HISTORY;
    resultKey: string = 'bars';

    async getHistoryBars(params: HistoryBars) {
        return await this.get(params, this.getStocksData);
    }

    

    getStocksData = async (bars: { [key: string] : Bar[] }) => {
        const stocks: Record<string, Stock[]> = {};

        for(let [key, value] of Object.entries(bars)) {
            stocks[key] = this.processStocks(value);
        }

        return stocks;
    }

    private processStocks(bars: Bar[]): Stock[] {
        return bars.map(bar => {
            const diff = bar.c - bar.o;
            const changePercent =  (diff / bar.c * 100).toPrecision(2);
            return { open: bar.o, close: bar.c, timestamp: bar.t, percent: changePercent };
        })
    }

}

const stockPricingService = new StockPricing();
export default stockPricingService;