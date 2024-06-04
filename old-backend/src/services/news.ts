import { AlpacaApi } from "./alpaca";

class NewsService extends AlpacaApi{
    defaultParameters: Record<string, any> = {
        sort: 'desc'
    }

    endpoint: string = '';
    resultKey: string = 'news';

}