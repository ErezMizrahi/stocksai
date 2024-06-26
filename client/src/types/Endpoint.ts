export interface Endpoint { 
    uri: string;
    method: 'GET' | 'POST';
    parameters?: Record<string,any>;
    responseType? : 'json'| 'stream' | 'blob';
}

