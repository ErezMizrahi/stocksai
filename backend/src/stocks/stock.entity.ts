import { User } from "src/users/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

@Entity()
export class LikedStocks {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('simple-array')
    likedSymbols: string[];

    @OneToOne(() => User, user => user.likedSymbols)
    @JoinColumn()
    user: User;
}