import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StocksController } from './stocks/stocks.controller';
import { StocksService } from './stocks/stocks.service';
import { StocksModule } from './stocks/stocks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { LikedStocks } from './stocks/stock.entity';
import { AuthService } from './users/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlpacaProvider } from './stocks/alpaca.provider';
import { HFProvider } from './stocks/huggingface.provider';
import { HFService } from './stocks/huggingface.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        url: configService.get<string>('POSTGRES_URL'),
        synchronize: true,
        entities: [User, LikedStocks],
    }) 
  }),
   
  JwtModule.register({
    global: true,
    secret: 'secret',
    signOptions: { expiresIn: '1h' },
  }), 
    StocksModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV}`})
  ],
  controllers: [AppController, StocksController, UsersController],
  providers: [AppService, StocksService, UsersService, AuthService, HFService, AlpacaProvider, HFProvider],
})
export class AppModule {}
