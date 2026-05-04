import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ModulesRepository {
    constructor(private readonly prisma: PrismaService) {}

    // create
    // update
    // remove

    findAll() {
        return this.prisma.module.findMany({
            orderBy: { createdAt: 'asc' }
        });
    }

    findById(moduleId: string) {
        return this.prisma.module.findUnique({
            where: { id: moduleId },
        });
    }
}