import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from '../models/user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from '../models/user.interface';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError} from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UserService {
    
    constructor (
        @InjectRepository(user) private readonly userRepository: Repository<user>,
        private authService: AuthService
    ) {}

    create(userNew: UserInterface): Observable<UserInterface> {
        return this.authService.hashPassword(userNew.password).pipe(
            switchMap((passwordHash: string)=>{
                const newUser = new user()
                newUser.name = userNew.name;
                newUser.email = userNew.email;
                newUser.username = userNew.username;
                newUser.password = passwordHash;
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: UserInterface) => {
                        const {password, ...result} = user
                        return result
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: number): Observable<UserInterface> {
        return from(this.userRepository.findOne({id})).pipe(
            map((user: UserInterface) => {
                const {password, ...result} = user;
                return result
            })
        )
    }

    findAll(): Observable<UserInterface[]> {
        return from(this.userRepository.find()).pipe(
            map((users)=>{
                users.forEach((v)=> {delete v.password});
                return users;
            })
        );
    }

    deleteOne(id: number) : Observable<any> {
        return from(this.userRepository.delete(id))
    }

    updateOne(id: number, user: UserInterface): Observable<any> {
        delete user.email;
        delete user.password;
        return from(this.userRepository.update(id, user))
    }

    login(user: UserInterface) : Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: UserInterface) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt))
                } else {
                    return 'Wrong Credentials'
                }
            })
        )
    }

    validateUser(email: string, password: string) : Observable<UserInterface> {
        return this.findByMail(email).pipe(
            switchMap((user: UserInterface) => this.authService.comparePassword(password, user.password).pipe(
                map((match: boolean)=>{
                    if (match) {
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )
    }

    findByMail(email: string) :Observable<UserInterface> {
        return from(this.userRepository.findOne({email}))
    }
}