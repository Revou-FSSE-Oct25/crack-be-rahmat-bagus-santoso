import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class QuizzesRepository {
    constructor(private readonly prisma: PrismaService) {}

    //create
    //update
    //delete

    findManyByLessonId(lessonId: string) {
        return this.prisma.quiz.findMany({
            where: { lessonId },
            orderBy: { orderNumber: 'asc'},
            include: { options: true },
        });
    }
}