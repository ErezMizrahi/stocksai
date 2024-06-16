import { ApiResponse } from "../types/ApiResponse";
import { Endpoint } from "../types/Endpoint";
import { client, sendRequest } from "../utils/client";
import { convertMapToUrlQueryParams } from "../utils/url.params";

export abstract class ApiBase {
    protected async requestHandler<T>(
        endpoint: Endpoint,
        parameters: Endpoint['parameters'], 
        signal?: AbortSignal | undefined,
        responseType: Endpoint['responseType'] = 'json'
    ): Promise<ApiResponse> {
        try {
            let params: string | Endpoint['parameters'];
            let url: string;

            if (endpoint.method === 'GET' && parameters) {
                params = convertMapToUrlQueryParams(parameters);
                url = `${endpoint.uri}${params}`;
            } else {
                console.log('here?', parameters)
                params = parameters;
                url = endpoint.uri;
            }

            const response = await client(url, {
                method: endpoint.method,
                data: endpoint.method === 'POST' ? params : null,
                responseType,
                headers: {
                 'Content-Type': responseType === 'stream' ? 'text/event-stream' : 'application/json'   
                }
            });

            console.log(response)


            if (responseType === 'stream') {
                return { success: response, response }; // Return the raw response
            }

            if (response.status < 200 || response.status > 299) {
                throw new Error(`fetch error status: ${response.statusText}`);
            }

            const json: T = response.data;
            return { success: json, response: response };
        } catch (e) {
            if (e instanceof Error && e.name !== 'AbortError') {
                console.error(e);
                throw e;
            }
            return { error: e }; // Return error message
        }
    }
}
