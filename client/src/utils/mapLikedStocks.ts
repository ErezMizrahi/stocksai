import { Ticker } from "../types/Ticker";

export const  mapLikedStocks = async(tickers: Ticker[] | null, likedStocks: string[]): Promise<Ticker[]> => {
    if(!tickers) return [];
    if(!likedStocks) return tickers;

    const likedStocksSet = new Set([...likedStocks]);
    const tickersRes = tickers.map(ticker => {
        if(likedStocksSet.has(ticker.symbol.toUpperCase())) {
            ticker.liked = true;
        } else {
            ticker.liked = false;
        }
        return ticker;
    });
    return tickersRes;
}