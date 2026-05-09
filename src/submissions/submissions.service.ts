import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChildrenService } from '../children/children.service';
import { BadgesService } from '../badges/badges.service';
import { ProgressService } from '../progress/progress.service';
import { SubmissionsRepository } from './submissions.repository';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly submissionsRepository: SubmissionsRepository,
    private readonly childrenService: ChildrenService,
    private readonly progressService: ProgressService,
    private readonly badgesService: BadgesService,
  ) {}

  async submit(
    parentId: string,
    childId: string,
    lessonId: string,
    quizId: string,
    submitQuizDto: SubmitQuizDto,
  ) {
    await this.childrenService.findOneByParent(parentId, childId);

    const quiz = await this.submissionsRepository.findQuizForSubmission(
      quizId,
      lessonId,
    );
    if (!quiz) {
      throw new NotFoundException('Quiz not found for this lesson');
    }

    const selectedOption = quiz.options.find(
      (option) => option.id === submitQuizDto.selectedOptionId,
    );
    if (!selectedOption) {
      throw new NotFoundException('Option not found for this quiz');
    }

    const isCorrect = selectedOption.isCorrect;
    const earnedPoints = isCorrect ? quiz.points : 0;

    const existing = await this.submissionsRepository.findExistingSubmission(
      childId,
      quizId,
    );
    if (existing) {
      throw new ConflictException('Quiz already submitted');
    }

    await this.submissionsRepository.createSubmission(
      childId,
      quizId,
      submitQuizDto.selectedOptionId,
      isCorrect,
      earnedPoints,
    );

    const moduleId = quiz.lesson.moduleId;
    const { isCompleted } = await this.progressService.updateAfterSubmission(
      childId,
      moduleId,
      earnedPoints,
    );

    const badge = isCompleted
      ? await this.badgesService.tryAwardBadge(childId, moduleId)
      : null;

    return {
      isCorrect,
      earnedPoints,
      explanation: quiz.explanation,
      badge,
    };
  }
}
