import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";

interface ClassConstructor {
    new (...args: any[]): {};
}

export const Serialize = (dto: ClassConstructor) => {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // console.log('im runing before handler', context);

        return handler.handle().pipe(
            map((data: any) => {
                // console.log('im runing before the request is sent out', data);
                return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
                
            })
        )
    }
    
}