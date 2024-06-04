import { Expose, Transform } from "class-transformer";

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Transform(({obj}) => obj.likedSymbols?.likedSymbols)
    @Expose()
    likedSymbols: string[];
}