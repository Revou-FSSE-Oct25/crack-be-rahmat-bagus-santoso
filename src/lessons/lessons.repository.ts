import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class LessonsRepository {
    constructor(private readonly prisma: PrismaService) {}

    //create
    //update
    //delete

    findAllByModuleId(moduleId: string) {
        return this.prisma.lesson.findMany({
            where: { moduleId },
            orderBy: { orderNumber: 'asc'},
        });
    }

    findById(lessonId: string) {
        return this.prisma.lesson.findUnique({
            where: { id: lessonId },
        });
    }
}