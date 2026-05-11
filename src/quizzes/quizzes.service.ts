import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { QuizzesRepository } from './quizzes.repository';
import { Quiz } from './entities/quiz.entity';
import { QuizForChild } from './entities/quiz-for-child.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly quizzesRepository: QuizzesRepository) {}

  async create(lessonId: string, createQuizDto: CreateQuizDto): Promise<Quiz> {
    this.ensureExactlyOneCorrectOption(createQuizDto.options);
    await this.ensureOrderNumberAvailable(lessonId, createQuizDto.orderNumber);

    const data: Prisma.QuizCreateInput = {
      question: createQuizDto.question,
      explanation: createQuizDto.explanation,
      orderNumber: createQuizDto.orderNumber,
      points: createQuizDto.points ?? 10,
      lesson: { 
        connect: { id: lessonId }
      },
      options: {
        create: createQuizDto.options.map((option) => ({
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        })),
      },
    };
    return this.quizzesRepository.create(data);
  }

  findAllForChildByLesson(lessonId: string): Promise<QuizForChild[]> {
    const quizzes = this.quizzesRepository.findManyByLessonIdForChild(lessonId);
    return quizzes;
  }

  async findOneOrFail(quizId: string): Promise<Quiz> {
    const quiz = await this.quizzesRepository.findByIdWithOptions(quizId);

    if(!quiz) {
      throw new NotFoundException('Quiz not Found');
    }

    return quiz;
  }

  async update(quizId: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.findOneOrFail(quizId);
    if(updateQuizDto.options !== undefined ) {
      this.ensureExactlyOneCorrectOption(updateQuizDto.options);
    }

    if(updateQuizDto.orderNumber !== undefined) {
      await this.ensureOrderNumberAvailable(quiz.lessonId, updateQuizDto.orderNumber, quizId);
    }

    const data: Prisma.QuizUpdateInput = {
      ...(updateQuizDto.question !== undefined && { question: updateQuizDto.question }),
      ...(updateQuizDto.explanation !== undefined && { explanation: updateQuizDto.explanation }),
      ...(updateQuizDto.orderNumber !== undefined && { orderNumber: updateQuizDto.orderNumber }),
      ...(updateQuizDto.points !== undefined && { points: updateQuizDto.points }),
      ...(updateQuizDto.options !== undefined && { 
        options: {
          deleteMany: {},
          create: updateQuizDto.options.map((option) => ({
            optionText: option.optionText,
            isCorrect: option.isCorrect,
          })),
        },
      }),
    };

    return this.quizzesRepository.update(quizId, data);
  }

  async remove(quizId: string): Promise<Quiz> {
    await this.findOneOrFail(quizId);
    return this.quizzesRepository.remove(quizId);
  }

  private ensureExactlyOneCorrectOption(
    options: Array<{ isCorrect: boolean }>,
  ): void {
    const correctCount = options.filter((option) => option.isCorrect).length;
    if (correctCount !== 1) {
      throw new BadRequestException('Quiz must have exactly one correct option');
    }
  }

  private async ensureOrderNumberAvailable(lessonId: string, orderNumber: number, excludeQuizId?: string): Promise<void> {
    const existing = await this.quizzesRepository.findByLessonAndOrderNumber(lessonId, orderNumber);
    if(existing && existing.id !== excludeQuizId) {
      throw new ConflictException( `Quiz with orderNumber ${orderNumber} already exist in this lesson` );
    }
  }
}
