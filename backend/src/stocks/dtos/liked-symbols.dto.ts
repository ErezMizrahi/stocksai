import { Expose, Transform } from "class-transformer";
import { User } from "../../users/user.entity";

export class LikedSymbolsDTO {
    @Expose()
    id: number;
    
    @Expose()
    likedSymbols: string;
    
    @Transform(({obj}) => obj.user?.id)
    @Expose()
    userId: number;
}