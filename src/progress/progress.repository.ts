import { Injectable } from "@nestjs/common";
import { ProgressStatus } from "@prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ProgressRepository {
    constructor(private readonly prisma: PrismaService) {}

    upsertProgress(childId: string, moduleId: string, earnedPoints: number) {
        return this.prisma.childModuleProgress.upsert({
            where: { 
                childId_moduleId: {
                    childId, moduleId
                }
            },
            create: {
                childId,
                moduleId,
                completedQuizzes: 1,
                totalPoints: earnedPoints,
                status: ProgressStatus.IN_PROGRESS,
            },
            update: {
                completedQuizzes: { increment: 1},
                totalPoints: { increment: earnedPoints },
            },
        });
    }

    markCompleted(childId: string, moduleId: string) {
        return this.prisma.childModuleProgress.update({
            where: { 
                childId_moduleId: {
                    childId, moduleId
                }
            },
            data: { status: ProgressStatus.COMPLETED },
        });
    }

    countTotalQuizzesInModule(moduleId: string): Promise<number> {
        return this.prisma.quiz.count({
            where: { 
                lesson: { moduleId }
            },
        });
    }
}