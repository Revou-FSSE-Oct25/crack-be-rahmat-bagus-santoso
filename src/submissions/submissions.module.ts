import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { PrismaService } from '../prisma.service';
import { SubmissionsRepository } from './submissions.repository';
import { ChildrenModule } from '../children/children.module';
import { ProgressModule } from '../progress/progress.module';
import { BadgesModule } from '../badges/badges.module';

@Module({
  imports: [ChildrenModule, ProgressModule, BadgesModule],
  controllers: [SubmissionsController],
  providers: [PrismaService, SubmissionsRepository, SubmissionsService],
})
export class SubmissionsModule {}
