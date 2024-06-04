const WebSocket = require('ws');
import stockPricingService from "./services/pricing";
import { Stock } from "./types/stock";
import { ENDPOINTS } from "./utils/constants";
import * as tf from '@tensorflow/tfjs-node';

const connect = async () => {

    const stocks = await stockPricingService.getHistoryBars({
        symbols: ['AAPL', 'TSLA', 'SPY', 'TQQQ'],
        timeframe: '1Day',
        start: '2023-04-10',
        end: '2024-04-10'
    });

     console.log('stocks',  stocks)


   

    // const wss = new WebSocket(ENDPOINTS.NEWS_SOCKET);

    // wss.on('open', () => {
    //     console.log("Websocket connected!");
    
    //     //auth
    //     wss.send(
    //         JSON.stringify({
    //             action: 'auth',
    //             key: process.env.ALPACA_KEY,
    //             secret: process.env.ALPACA_SECRET
    //         })
    //     );
    
    //     //subscribe to news
    //     wss.send(
    //         JSON.stringify({
    //             action: 'subscribe',
    //             news: ['*']
    //         })
    //     )
    // });
    
    // wss.on('message', (msg: string) => {
    //     console.log("Message is " + msg);
    
    // });
    
    // wss.on('close', () => {
    //     console.log('Disconnected from server');
    // });
}


 export { connect }
