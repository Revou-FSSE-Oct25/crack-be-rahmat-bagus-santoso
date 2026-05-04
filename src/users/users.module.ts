import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordModule } from '../password/password.module';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [PasswordModule],
  controllers: [UsersController],
  providers: [PrismaService, UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
