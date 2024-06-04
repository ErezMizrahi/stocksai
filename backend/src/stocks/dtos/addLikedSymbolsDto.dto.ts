import { Transform } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class AddLikedSymbolsDto { 
    @IsArray()
    @Transform(({obj}) => obj.likedSymbols.map((s: string) => s.toUpperCase()))
    likedSymbols: string[];
}