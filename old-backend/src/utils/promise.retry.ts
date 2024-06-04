export const retryPromise = async (promise: Promise<any>, retries: number = 3): Promise<Response> => {
    return promise.catch((error) => {
        if(retries > 0) {
            return retryPromise(promise, retries - 1);
        }
        return Promise.reject(error);
    });
}