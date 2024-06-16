import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [ TypeOrmModule.forFeature([User]), 
    ],
    providers: [ 
        UsersService,
        AuthService,
        {
            provide: APP_INTERCEPTOR,
            useClass: CurrentUserInterceptor
        },
        
    ],
    controllers: [ UsersController ],
    exports: [ TypeOrmModule ]
})
export class UsersModule {}
