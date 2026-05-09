import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { PrismaService } from '../prisma.service';
import { ProgressRepository } from './progress.repository';

@Module({
  controllers: [ProgressController],
  providers: [PrismaService, ProgressRepository, ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
