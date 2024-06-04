import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddLikedSymbolsDto } from './dtos/addLikedSymbolsDto.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { LikedSymbolsDTO } from 'src/stocks/dtos/liked-symbols.dto';
import { HFService } from './huggingface.service';
import { Response } from 'express';

@Controller('stocks')
@UseGuards(AuthGuard)
export class StocksController {
    constructor(private readonly stocksService: StocksService, private readonly hfService: HFService) {}

    @Get('/symbols')
    getSymbols(@Query('query') query: string) {
        return this.stocksService.getSymbols(query);
    }

    @Post('/add-symbol')
    @Serialize(LikedSymbolsDTO)
    addLikedSymbols(@Body() body: AddLikedSymbolsDto, @CurrentUser() user: User) {
        return this.stocksService.addLikedSymbols(body, user);
    }

    @Get('/my-stocks')
    async getMyStocksData(@CurrentUser() user: User) {
        const res = await this.hfService.generateResponse('hey there how are you?');
        console.log('res', res);
        return this.stocksService.getMyStocksData(user);
    }

    @Get('/stock-history')
    getStockHistory(@Query('symbol') symbol: string, @Query('days') numberOfDaysAgo: number) {
        return this.stocksService.getHistory(symbol, numberOfDaysAgo);
    }

    @Get('/news-history')
    getNewsHistory(@Query('symbol') symbol, @Query('days') numberOfDaysAgo: number) {
        return this.stocksService.getNewsHistory(symbol, numberOfDaysAgo);
    }

    @Get('/ask-ai')
    async getStocksAiOpinionOnStock(@Query('symbol') symbol, @Res() res: Response) {
        res.setHeader('Content-Type', 'text/plain');
        res.flushHeaders();

        const response = await this.hfService.generateResponse(`improve this propmt Analyze the stock performance of ${symbol}. include summarized fundamentals analysis and other key metrics.`);
        for await(const chunk of response) {
            res.write(chunk.token.text);
            await new Promise(resolve => setTimeout(resolve, 100)); // Adjust delay as needed
        }
    
        res.end();
    }
}
