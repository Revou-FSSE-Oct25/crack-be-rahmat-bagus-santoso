import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { QuizzesRepository } from './quizzes.repository';

@Module({
  controllers: [QuizzesController],
  providers: [PrismaService, QuizzesRepository, QuizzesService],
  exports: [QuizzesService]
})
export class QuizzesModule {}
