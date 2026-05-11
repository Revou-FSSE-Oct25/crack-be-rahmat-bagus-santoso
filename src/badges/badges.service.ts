import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BadgesRepository } from './badges.repository';
import { Badge } from './entities/badge.entity';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Injectable()
export class BadgesService {
  constructor(private readonly badgesRepository: BadgesRepository) {}

  async create(moduleId: string, createBadgeDto: CreateBadgeDto): Promise<Badge> {
    const existing = await this.badgesRepository.findByModuleId(moduleId);
    if(existing) {
      throw new ConflictException('This module has a badge');
    }

    const data: Prisma.BadgeCreateInput = {
      ...createBadgeDto,
      module: {
        connect: { id: moduleId },
      }
    };

    return this.badgesRepository.create(data);
  }

  async update(badgeId: string, updateBadgeDto: UpdateBadgeDto): Promise<Badge> {
    await this.findOneOrFail(badgeId);
    const data: Prisma.BadgeUpdateInput = {
      ...updateBadgeDto,
    };

    return this.badgesRepository.update(badgeId, data);
  }

  async remove(badgeId: string): Promise<Badge> {
    await this.findOneOrFail(badgeId);
    return this.badgesRepository.remove(badgeId);
  }

  async tryAwardBadge(childId: string, moduleId: string): Promise<Badge | null> {
    const badge = await this.badgesRepository.findByModuleId(moduleId);
    if (!badge) return null;

    const alreadyAwarded = await this.badgesRepository.hasChildBadge(childId, badge.id);
    if (alreadyAwarded) return null;

    await this.badgesRepository.awardBadge(childId, badge.id);
    return badge;
  }

  private async findOneOrFail(badgeId: string): Promise<Badge> {
    const badge = await this.badgesRepository.findById(badgeId);
    if(!badge) {
      throw new NotFoundException('Badge not found');
    }

    return badge;
  }
}
