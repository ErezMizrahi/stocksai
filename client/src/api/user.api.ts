import { ApiResponse } from "../types/ApiResponse";
import { ApiBase } from "./api.base";
import { endpoints } from "./endpoints";

class UserApi extends ApiBase {
    async login(email: string, password: string, signal?: AbortSignal | undefined): Promise<ApiResponse> {
        const json = await this.requestHandler<any>(endpoints.login, { email, password }, signal);
        if(json.error) throw new Error(json.error);

        return json;
    }

    async signup(email: string, password: string, signal?: AbortSignal | undefined): Promise<ApiResponse> {
        console.log(endpoints)
        const json = await this.requestHandler<any>(endpoints.signup, { email, password }, signal);
        if(json.error) throw new Error(json.error);

        return json;
    }
}


const userApi = new UserApi();
export default userApi;
