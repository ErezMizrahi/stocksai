import { LikedStocks } from 'src/stocks/stock.entity';
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, OneToOne } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column() 
    email: string;
    @Column() 
    password: string;

    @OneToOne(() => LikedStocks, likedStocks => likedStocks.user)
    likedSymbols: LikedStocks;

    @AfterInsert()
    private logInsert() {
        console.log('Inserted User with id', this.id);
    }
}