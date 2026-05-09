import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { PrismaService } from '../prisma.service';
import { BadgesRepository } from './badges.repository';

@Module({
  controllers: [BadgesController],
  providers: [PrismaService, BadgesRepository, BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}
