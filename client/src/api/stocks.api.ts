import { Article } from "../types/Article";
import { Stock, Ticker } from "../types/Ticker";
import { mapLikedStocks } from "../utils/mapLikedStocks";
import { ApiBase } from "./api.base";
import { endpoints } from "./endpoints";

class StocksApi extends ApiBase {
    async searchStocks(query: string, likedStocks: string[], signal: AbortSignal | undefined): Promise<Ticker[]> {
        if(query.length < 1) return new Promise((resolve, reject) => resolve([]));

        const json = await this.requestHandler<Ticker[]>(endpoints.stocksQuery, { query }, signal);
        if(json.error) throw new Error(json.error);

        return await mapLikedStocks(json.success, likedStocks);
    }

    async likeStock(symbols: string[], signal?: AbortSignal | undefined): Promise<void> {
        const json = await this.requestHandler(endpoints.addLike, {likedSymbols: symbols}, signal);
        if(json.error) throw new Error(json.error);
        return;
    }

    async getLikedStockData(signal?: AbortSignal | undefined): Promise<Stock[]> {
        const json = await this.requestHandler<Stock[]>(endpoints.getLikedStocksData, signal);
        if(json.error) throw new Error(json.error);
        return json.success;
    }

    async getStockHistory(symbol: string, days: number = 1, signal?: AbortSignal | undefined): Promise<Stock[]> {
        const json = await this.requestHandler<Stock[]>(endpoints.getStockHistory, { symbol, days }, signal);
        if(json.error) throw new Error(json.error);
        return json.success;
    }

    async getNewsHistory(symbol: string, days: number = 1, signal?: AbortSignal | undefined): Promise<Article[]> {
        console.log({ symbol, days })
        const json = await this.requestHandler<Article[]>(endpoints.getNewsHistory, { symbol, days }, signal);
        if(json.error) throw new Error(json.error);
        console.log(json)
        return json.success;
    }
}


const stocksApi = new StocksApi();
export default stocksApi;
