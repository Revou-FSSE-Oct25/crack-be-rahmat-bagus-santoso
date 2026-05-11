import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LessonsRepository } from './lessons.repository';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async create(
    moduleId: string,
    createLessonDto: CreateLessonDto,
  ): Promise<Lesson> {
    await this.ensureOrderNumberAvailable(
      moduleId,
      createLessonDto.orderNumber,
    );

    const data: Prisma.LessonCreateInput = {
      title: createLessonDto.title,
      content: createLessonDto.content,
      orderNumber: createLessonDto.orderNumber,
      module: {
        connect: { id: moduleId },
      },
    };
    return this.lessonsRepository.create(data);
  }

  findAllByModule(moduleId: string): Promise<Lesson[]> {
    return this.lessonsRepository.findAllByModuleId(moduleId);
  }

  async findOne(lessonId: string): Promise<Lesson> {
    const existingLesson = await this.lessonsRepository.findById(lessonId);

    if (!existingLesson) {
      throw new NotFoundException('Lesson not found');
    }
    return existingLesson;
  }

  async update(
    lessonId: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    const lesson = await this.findOne(lessonId);

    if (updateLessonDto.orderNumber !== undefined) {
      await this.ensureOrderNumberAvailable(
        lesson.moduleId,
        updateLessonDto.orderNumber,
        lessonId,
      );
    }

    const data: Prisma.LessonUpdateInput = { ...updateLessonDto };
    return this.lessonsRepository.update(lessonId, data);
  }

  async remove(lessonId: string): Promise<Lesson> {
    await this.findOne(lessonId);
    return this.lessonsRepository.remove(lessonId);
  }

  private async ensureOrderNumberAvailable(
    moduleId: string,
    orderNumber: number,
    excludeLessonId?: string,
  ): Promise<void> {
    const existing = await this.lessonsRepository.findByModuleAndOrderNumber(
      moduleId,
      orderNumber,
    );
    if (existing && existing.id !== excludeLessonId) {
      throw new ConflictException(
        `Lesson with orderNumber ${orderNumber} already exists in this module`,
      );
    }
  }
}
