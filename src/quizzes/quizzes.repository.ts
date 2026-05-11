import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class QuizzesRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(data: Prisma.QuizCreateInput) {
        return this.prisma.quiz.create({
            data,
            include: { options: true },
        });
    }

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

    findByLessonAndOrderNumber(lessonId: string, orderNumber: number) {
        return this.prisma.quiz.findUnique({
            where: {
                lessonId_orderNumber: {
                    lessonId, orderNumber
                }
            },
        })
    }

    update(quizId: string, data: Prisma.QuizUpdateInput) {
        return this.prisma.quiz.update({
            where: { id: quizId },
            data,
            include: { options: true },
        });
    }

    remove(quizId: string) {
        return this.prisma.quiz.delete({
            where: { id: quizId },
            include : { options: true },
        });
    }
}