import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { ModulesRepository } from './modules.repository';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [LessonsModule],
  controllers: [ModulesController],
  providers: [PrismaService, ModulesRepository, ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
