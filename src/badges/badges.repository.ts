import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Badge } from "./entities/badge.entity";

@Injectable()
export class BadgesRepository {
    constructor(private readonly prisma: PrismaService) {}

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
}