import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LessonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.LessonCreateInput) {
    return this.prisma.lesson.create({ data });
  }

  findAllByModuleId(moduleId: string) {
    return this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { orderNumber: 'asc' },
    });
  }

  findById(lessonId: string) {
    return this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
  }

  findByModuleAndOrderNumber(moduleId: string, orderNumber: number) {
    return this.prisma.lesson.findUnique({
      where: {
        moduleId_orderNumber: {
          moduleId, orderNumber
        }
      },
    });
  }

  update(lessonId: string, data: Prisma.LessonUpdateInput) {
    return this.prisma.lesson.update({
        where: { id: lessonId },
        data,
    });
  }

  remove(lessonId: string) {
    return this.prisma.lesson.delete({
        where: { id: lessonId },
    })
  }
}
