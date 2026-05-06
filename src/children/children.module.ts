import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';
import { ChildrenRepository } from './children.repository';

@Module({
  controllers: [ChildrenController],
  providers: [PrismaService, ChildrenRepository, ChildrenService],
  exports: [ChildrenService],
})
export class ChildrenModule {}
