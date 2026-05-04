import { Injectable } from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { QuizzesRepository } from './quizzes.repository';

@Injectable()
export class QuizzesService {
  constructor(private readonly quizzesRepository: QuizzesRepository) {}

  // create(createQuizDto: CreateQuizDto) {
  //   return 'This action adds a new quiz';
  // }

  findAllByLesson(lessonId: string): Promise<Quiz[]> {
    return this.quizzesRepository.findManyByLessonId(lessonId);;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} quiz`;
  // }

  // update(id: number, updateQuizDto: UpdateQuizDto) {
  //   return `This action updates a #${id} quiz`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} quiz`;
  // }
}
