import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonsRepository } from './lessons.repository';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}
  
  // create(createLessonDto: CreateLessonDto) {
  //   return 'This action adds a new lesson';
  // }

  findAllByModule(moduleId: string): Promise<Lesson[]> {
    return this.lessonsRepository.findAllByModuleId(moduleId);
  }

  async findOne(lessonId: string): Promise<Lesson> {
    const existingLesson = await this.lessonsRepository.findById(lessonId);

    if(!existingLesson) {
      throw new NotFoundException('Lesson not found');
    }
    return existingLesson;
  }

  // update(id: number, updateLessonDto: UpdateLessonDto) {
  //   return `This action updates a #${id} lesson`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} lesson`;
  // }
}
