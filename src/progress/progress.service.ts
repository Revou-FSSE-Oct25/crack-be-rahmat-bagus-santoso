import { Injectable } from '@nestjs/common';
import { ProgressRepository } from './progress.repository';
import { ProgressModule } from './progress.module';

@Injectable()
export class ProgressService {
  constructor(private readonly progressRepository: ProgressRepository) {}

  async updateAfterSubmission(
    childId: string,
    moduleId: string,
    earnedPoints: number,
  ): Promise<{ isCompleted: boolean }> {
    const progress = await this.progressRepository.upsertProgress(childId, moduleId, earnedPoints);
    const totalQuizzes = await this.progressRepository.countTotalQuizzesInModule(moduleId);

    const isCompleted = progress.completedQuizzes >= totalQuizzes;

    if (isCompleted) {
      await this.progressRepository.markCompleted(childId, moduleId);
    }

    return { isCompleted };
  }

  async getProgressByChild(childId: string) {
    return this.progressRepository.findAllByChildId(childId);
  }
}
