import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ModulesModule } from '../modules/modules.module';
import { LessonsModule } from '../lessons/lessons.module';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { BadgesModule } from '../badges/badges.module';

@Module({
  imports: [ModulesModule, LessonsModule, QuizzesModule, BadgesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
