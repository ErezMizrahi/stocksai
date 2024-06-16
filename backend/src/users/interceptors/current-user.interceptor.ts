import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const payload = request.payload || undefined;
        console.log(payload);
        
        // const token = this.extractTokenFromHeader(request);
        // if (!token) {
        //   throw new UnauthorizedException();
        // }

        // try {
        //     const payload = await this.jwtService.verifyAsync(
        //       token,
        //       {
        //         secret: 'secret'
        //       }
        //     );
           
            const userId  = payload?.id || undefined;
            if(userId){
                const user = await this.usersService.findOne(userId);
                request.currentUser = user;
            }

        //     return handler.handle();
        //   } catch(e) {
        //     console.log(e)
        //     throw new UnauthorizedException();
        //   }

        return handler.handle();
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}