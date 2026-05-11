import { Injectable } from "@nestjs/common";
import { Prisma } from '@prisma/client';
import { PrismaService } from "../prisma.service";

@Injectable()
export class ModulesRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(data: Prisma.ModuleCreateInput) {
        return this.prisma.module.create({
            data,
            include: { badge: true },
        });
    }

    findAll(search?: string) {
        return this.prisma.module.findMany({
            where: search ? {
                title: { contains: search, mode: 'insensitive'}
            } : undefined,
            orderBy: { createdAt: 'asc' },
            include: {
                badge: true,
            },
        });
    }

    findById(moduleId: string) {
        return this.prisma.module.findUnique({
            where: { id: moduleId },
            include: {
                badge: true,
            },
        });
    }

    findByTitle(title: string) {
        return this.prisma.module.findFirst({
            where: { title },
            include: { badge: true },
        });
    }

    update(moduleId: string, data: Prisma.ModuleUpdateInput) {
        return this.prisma.module.update({
            where: { id: moduleId },
            data,
            include: { badge: true },
        });
    }

    remove(moduleId: string) {
        return this.prisma.module.delete({
            where: { id: moduleId },
        });
    }
}
