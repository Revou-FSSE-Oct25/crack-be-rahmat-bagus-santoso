import { Injectable } from "@nestjs/common";
import { Prisma } from '@prisma/client';
import { PrismaService } from "../prisma.service";

@Injectable()
export class ChildrenRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(data: Prisma.ChildCreateInput) {
        return this.prisma.child.create({ data });
    }

    findManyByParentId(parentId: string) {
        return this.prisma.child.findMany({
            where: { parentId },
        });
    }

    findById(id: string) {
        return this.prisma.child.findUnique({
            where: { id }
        });
    }

    update(id: string, data: Prisma.ChildUpdateInput) {
        return this.prisma.child.update({
            where: { id },
            data,
        })
    }

    remove(id: string) {
        return this.prisma.child.delete({
            where: { id }
        });
    }
}