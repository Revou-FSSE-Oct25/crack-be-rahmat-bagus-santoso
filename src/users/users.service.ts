import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { PasswordService } from '../password/password.service';

export type SafeUser = Omit<User, 'password'>;
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService
  ) {}

  // create new user from register.auth.service and next admin by admin from create.admin.user.service, still on discussion
  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.toSafeUser(user);
  }

  // login dan cek email saat register
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  // admin needs
  async findAll(): Promise<SafeUser[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(id: string): Promise<SafeUser> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toSafeUser(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<SafeUser> {
    const existingUser = await this.usersRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException(' User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const existingEmail = await this.usersRepository.findByEmail(updateUserDto.email);

      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    const data: Prisma.UserUpdateInput = {
      ...updateUserDto,
    }

    if (updateUserDto.password) {
      data.password = await this.passwordService.hashPassword(updateUserDto.password);
    }

    const updatedData = await this.usersRepository.update(id, data);
    return this.toSafeUser(updatedData);
  }

  async remove(id: string): Promise<SafeUser> {
    const existingUser =  await this.usersRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found')
    }
    const deletedUser = await this.usersRepository.remove(id);
    return this.toSafeUser(deletedUser);
  }

  private toSafeUser(user: User): SafeUser {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}
