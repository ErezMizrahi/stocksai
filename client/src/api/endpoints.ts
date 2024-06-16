import { Endpoint } from "../types/Endpoint";

export const endpoints: Record<string, Endpoint> = { 
    stocksQuery: { 
        uri: '/stocks/symbols', 
        method: 'GET', 
    },
    getLikedStocksData: { 
        uri: '/stocks/my-stocks', 
        method: 'GET', 
    },
    getStockHistory: { 
        uri: '/stocks/stock-history', 
        method: 'GET', 
    },
    addLike: { 
        uri: '/stocks/add-symbol', 
        method: 'POST', 
    },
    whoami: { 
        uri: '/auth/whoami', 
        method: 'GET'
    },
    login: { 
        uri: '/auth/signin', 
        method: 'POST'
    },
    signup: { 
        uri: '/auth/signup', 
        method: 'POST'
    },
    getNewsHistory: { 
        uri: '/stocks/news-history', 
        method: 'GET', 
    },
    askAi: { 
        uri: '/stocks/ask-ai', 
        method: 'POST', 
    },
}