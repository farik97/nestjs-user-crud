import { Controller, Post, Get, Delete, Body, Param, Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserInterface } from '../models/user.interface';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    create( @Body() user: UserInterface ) : Observable< UserInterface | Object> 
    {
        return this.userService.create(user).pipe(
            map((user: UserInterface) => user),
            catchError(err => of({error: err.message}))
        );
    }

    @Post('login')
    login( @Body() user: UserInterface) : Observable<Object> {
        return this.userService.login(user).pipe(
            map( (jwt: string) => { 
                return {access_token: jwt};
            })
        )
    }

    @Get(':id')
    findOne(@Param() params) : Observable<UserInterface> {
        return this.userService.findOne(params.id);
    }

    @Get()
    findAl(): Observable<UserInterface[]> {
        return this.userService.findAll();
    }

    @Delete(':id')
    deleteOne(@Param() params) : Observable<UserInterface> {
        return this.userService.deleteOne(Number(params.id))
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: UserInterface) : Observable<any> {
        return this.userService.updateOne(Number(id),  user)
    }
}
