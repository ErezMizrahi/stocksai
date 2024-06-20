export interface Ticker {
    symbol: string;
    name: string;
    liked?: boolean;
}

export interface Stock {
    symbol: string;
    open: number;
    close: number;
    timestamp: string;
    percent: string;
}

export interface StockPageData {
    stockData: Stock[];
    corporateData: any;
}