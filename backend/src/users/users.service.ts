import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    findOne(id: number){
        if(!id) {
            throw new UnauthorizedException();
        };
        
        return this.repo.findOne({
            where: { id },
            relations: ['likedSymbols']
         });
    }

    find(email: string) {
        return this.repo.find({
            where: { email },
            relations: ['likedSymbols']
         });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);

        if(!user) throw new NotFoundException('user not found');

        Object.assign(user, attrs);

        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);

        if(!user) throw new NotFoundException('user not found');

        return this.repo.remove(user);
    }
}
