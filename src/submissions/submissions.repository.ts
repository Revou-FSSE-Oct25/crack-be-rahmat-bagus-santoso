import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubmissionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findQuizForSubmission(quizId: string, lessonId: string) {
    return this.prisma.quiz.findFirst({
      where: { id: quizId, lessonId },
      include: {
        options: true,
        lesson: {
          select: { moduleId: true },
        },
      },
    });
  }

  findExistingSubmission(childId: string, quizId: string) {
    return this.prisma.childQuizSubmission.findUnique({
        where: {
            childId_quizId: {
                childId, quizId
            }
        },
    });
  }
  
  createSubmission(
    childId: string,
    quizId: string,
    selectedOptionId: string,
    isCorrect: boolean,
    earnedPoints: number,
  ) {
    return this.prisma.childQuizSubmission.create({
        data: {
            childId,
            quizId,
            selectedOptionId,
            isCorrect,
            earnedPoints
        },
    });
  }
}
