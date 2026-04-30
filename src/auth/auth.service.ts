import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "../users/users.service";
import { PasswordService } from "../password/password.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService,
    ) {}

    
    async register(registerDto: RegisterDto){
        const user = await this.usersService.create(registerDto);

        return {
            message: 'User registered successfully',
            data: user,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);

        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.passwordService.comparePassword(
            loginDto.password,
            user.password,
        );

        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        return {
            message: 'Login successful',
        accessToken: this.jwtService.sign(payload),
        }
    }

    logout(){
        return {
            message:
            'Logged out successfully'
        };
    }
}