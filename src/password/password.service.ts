import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
    private readonly salt = Number(process.env.BCRYPT_SALT_ROUND ?? 10);

    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.salt);
    }

    comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}