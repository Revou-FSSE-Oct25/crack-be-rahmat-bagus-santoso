import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class QuizzesRepository {
    constructor(private readonly prisma: PrismaService) {}

    //create
    //update
    //delete

    findManyByLessonIdForChild(lessonId: string) {
        return this.prisma.quiz.findMany({
            where: { lessonId },
            orderBy: { orderNumber: 'asc'},
            include: {
                options: {
                    select: {
                        id: true,
                        optionText: true,
                        quizId: true,
                    },
                },
            },
        });
    }

    findByIdWithOptions(quizId: string) {
        return this.prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                options: true,
            },
        });
    }
}