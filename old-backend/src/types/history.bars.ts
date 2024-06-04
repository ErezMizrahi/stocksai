export interface HistoryBars { 
    symbols: string[];
    timeframe: string;
    start?: string;
    end?: string;
    page_token?: string;
}

export interface DefaultHistoryBars { 
    limit: number,
    adjustment: string,
    feed: string,
    sort: string
}

export interface HistoryBarsResult {
    bars: { [key: string] : Bar[] },
    next_page_token? : string | null;
}

export interface Bar {
    c: number;
    h: number;
    l: number;
    n: number;
    o: number;
    t: string;
    v: number;
    vw: number;
}