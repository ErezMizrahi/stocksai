export const convertMapToUrlQueryParams = (params: {}): string => {
    let queryParams = '';

    for(let [key, value] of Object.entries(params)) {
        if(queryParams.length < 1) {
            queryParams += `?${key}=${value}`;
        } else {
            queryParams += `&${key}=${value}`;
        }
    }

    return queryParams;
}