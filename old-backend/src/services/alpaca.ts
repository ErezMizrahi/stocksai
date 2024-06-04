import { retryPromise } from "../utils/promise.retry";
import { convertMapToUrlQueryParams } from "../utils/url.params";

interface AlpacaResponse {
    next_page_token: string;
    [key: string]: any;
}

export abstract class AlpacaApi {
    abstract readonly defaultParameters: Record<string, any>;
    abstract readonly endpoint: string;
    abstract readonly resultKey: string;

    private getLimit(params: any): number {
        const startDate = new Date(params.start).getTime();
        const endDate = new Date(params.end).getTime();
        return (Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) - 1);
    }

    protected async get(params: any, callback: Function, retryCount: number = 3): Promise<any> {
        try { 
            const symbols = params.symbols as string[];
            params.limit = this.getLimit(params);

            const promises = symbols.map((symbol) =>{
                const queryParams = convertMapToUrlQueryParams({...params, ...this.defaultParameters, symbols: [symbol] });
                return retryPromise(fetch(this.endpoint + queryParams, {
                    headers: {
                        'APCA-API-KEY-ID': process.env.ALPACA_KEY!,
                        'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET!,
                    }
                }));
            });

            const restuls = await Promise.allSettled(promises);

            const results = [];
            for await(let promiseResult of restuls) {
                if(promiseResult.status === 'fulfilled') {
                    const json : AlpacaResponse = await promiseResult.value.json() as AlpacaResponse;
                    const action = json[this.resultKey];
                    results.push( await callback(action) );
                    continue;
                }
               
            }
        
            return results;
        } catch (e) {
            console.error(e, this.endpoint, retryCount);
            if(retryCount > 0) {
                return await this.get(params, callback, retryCount - 1);
            }
            return []
        }
    }

}



