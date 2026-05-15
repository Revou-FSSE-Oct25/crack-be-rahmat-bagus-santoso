import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';
import { ChildrenRepository } from './children.repository';
import { LessonsModule } from '../lessons/lessons.module';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { ProgressModule } from '../progress/progress.module';

@Module({
  imports: [LessonsModule, QuizzesModule, ProgressModule],
  controllers: [ChildrenController],
  providers: [PrismaService, ChildrenRepository, ChildrenService],
  exports: [ChildrenService],
})
export class ChildrenModule {}
