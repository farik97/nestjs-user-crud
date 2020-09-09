import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateJWT (user: Object) : Observable <string> {
        return from(this.jwtService.signAsync({user}))
    }

    hashPassword(password: String) : Observable <string> {
        return from<string>(bcrypt.hash(password, 12))
    }

    comparePassword(newPassword: string, passwortHash: string): Observable<any>{
        return from(bcrypt.compare(newPassword, passwortHash));
    }

}