import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaService } from 'src/prisma.service';
import { LessonsRepository } from './lessons.repository';

@Module({
  controllers: [LessonsController],
  providers: [PrismaService, LessonsRepository, LessonsService],
  exports: [LessonsService]
})
export class LessonsModule {}
