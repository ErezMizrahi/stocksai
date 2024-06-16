import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Response, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/user-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService, private readonly authServie: AuthService,  private readonly jwtService: JwtService) {}

    // @Get('whoami')
    // whoAmI(@Session() session: any) {
    //     return this.usersService.findOne(session.userId);
    // }

    @Get('whoami')
    @UseGuards(AuthGuard)
    @Serialize(UserDto)
    whoAmI(@CurrentUser() user: string) {
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDTO) {
        const user = await this.authServie.signUp(body.email, body.password);
        const payload = { id: user.id};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDTO) {
        const user = await this.authServie.signIn(body.email, body.password);   
        const payload = { id: user.id};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    // @Post('signout')
    // signout(@Session() session: any) {
    //     session.userId = null;
    // }

    @Get('/:id')
    @Serialize(UserDto)
    async findUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        if(!user) throw new NotFoundException('user not found');
        return user;
    }

    @Get()
    @Serialize(UserDto)
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    @Serialize(UserDto)
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    @Serialize(UserDto)
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO ) {
        return this.usersService.update(parseInt(id), body);
    }
}
