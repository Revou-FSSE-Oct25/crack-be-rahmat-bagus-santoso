import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { Badge } from "./entities/badge.entity";

@Injectable()
export class BadgesRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(data: Prisma.BadgeCreateInput): Promise<Badge> {
        return this.prisma.badge.create({ data });
    }

    findById(badgeId: string): Promise<Badge | null> {
        return this.prisma.badge.findUnique({
            where: { id: badgeId },
        });
    }

    findByModuleId(moduleId: string): Promise<Badge | null> {
        return this.prisma.badge.findUnique({
            where: { moduleId },
        });
    }

    async hasChildBadge(childId: string, badgeId: string): Promise<boolean> {
        const record = await this.prisma.childBadge.findUnique({
            where: { 
                childId_badgeId: {
                    childId, badgeId
                }
            },
        });
        return record !== null;
    }

    awardBadge(childId: string, badgeId: string) {
        return this.prisma.childBadge.create({
            data: { childId, badgeId },
        });
    }

    update(badgeId: string, data: Prisma.BadgeUpdateInput): Promise<Badge> {
        return this.prisma.badge.update({
            where: { id: badgeId },
            data,
        });
    }

    remove(badgeId: string): Promise<Badge> {
        return this.prisma.badge.delete({
            where: { id: badgeId },
        });
    }
}