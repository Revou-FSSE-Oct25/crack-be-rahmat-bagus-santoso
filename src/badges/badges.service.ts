import { Injectable } from '@nestjs/common';

import { BadgesRepository } from './badges.repository';
import { Badge } from './entities/badge.entity';

@Injectable()
export class BadgesService {
  constructor(private readonly badgesRepository: BadgesRepository) {}

  async tryAwardBadge(childId: string, moduleId: string): Promise<Badge | null> {
    const badge = await this.badgesRepository.findByModuleId(moduleId);
    if (!badge) return null;

    const alreadyAwarded = await this.badgesRepository.hasChildBadge(childId, badge.id);
    if (alreadyAwarded) return null;

    await this.badgesRepository.awardBadge(childId, badge.id);
    return badge;
  }
}
