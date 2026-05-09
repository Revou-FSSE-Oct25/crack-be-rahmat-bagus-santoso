import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { QuizForChild } from './entities/quiz-for-child.entity';
import { QuizzesRepository } from './quizzes.repository';

@Injectable()
export class QuizzesService {
  constructor(private readonly quizzesRepository: QuizzesRepository) {}

  // create(createQuizDto: CreateQuizDto) {
  //   return 'This action adds a new quiz';
  // }

  findAllForChildByLesson(lessonId: string): Promise<QuizForChild[]> {
    const quizzes = this.quizzesRepository.findManyByLessonIdForChild(lessonId);
    return quizzes;
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

  async findOneOrFail(quizId: string): Promise<Quiz> {
    const quiz = await this.quizzesRepository.findByIdWithOptions(quizId);

    if(!quiz) {
      throw new NotFoundException('Quiz not Found');
    }

    return quiz;
  }
}
