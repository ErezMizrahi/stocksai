import { ApiResponse } from "../types/ApiResponse";
import { Endpoint } from "../types/Endpoint";
import { convertMapToUrlQueryParams } from "../utils/url.params";



export abstract class ApiBase {
    protected async requestHandler<T>(
        endpoint: Endpoint,
        parameters: Endpoint['parameters'], 
        signal?: AbortSignal | undefined): Promise<ApiResponse> {
        try {
            let params: string;
            let url: string;

            if(endpoint.method === 'GET' && parameters) {
                params = convertMapToUrlQueryParams(parameters);
                url = `${endpoint.uri}${params}`;
            } else {
                params = JSON.stringify(parameters);
                url = endpoint.uri;
            }

            const response = await fetch(url, {
                method: endpoint.method,
                headers: { 'Content-Type': 'application/json' },
                body: endpoint.method === 'POST' ? params : null,
                signal
            }); 
    
            if(!response.ok) throw new Error(`fetch error status: ${response.status}`); 

            const json: T = await response.json();
            return { success: json };
        } catch (e) {
            if (e instanceof Error && e.name !== 'AbortError') {
                console.error(e);
                return { error: e.message};
            }
            return { error: '' };

        }
    }
}