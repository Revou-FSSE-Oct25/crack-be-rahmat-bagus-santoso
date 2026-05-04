import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Child } from './entities/child.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ChildrenRepository } from './children.repository';
import { AccessChildDto } from './dto/access-child.dto';

@Injectable()
export class ChildrenService {
  constructor (
    private readonly childRepository: ChildrenRepository
  ) {}

  async create(parentId: string, createChildDto: CreateChildDto): Promise<Child> {
    const data: Prisma.ChildCreateInput = {
      ...createChildDto,
      parent: {
        connect: {
          id: parentId,
        },
      },
    };

    return this.childRepository.create(data);
  }

  async findAllByParent(parentId: string): Promise<Child[]> {
    return this.childRepository.findManyByParentId(parentId);
  }

  async findOneByParent(parentId: string, childId: string) {
    return this.findOwnedChildOrFail(parentId, childId);
  }

  async update(parentId: string, childId: string, updateChildDto: UpdateChildDto) {
    await this.findOwnedChildOrFail(parentId, childId);

    const data: Prisma.ChildUpdateInput = {
      ...updateChildDto,
    };

    return this.childRepository.update(childId, data);
  }

  async remove(parentId: string, childId: string) {
    await this.findOwnedChildOrFail(parentId, childId);
    
    return this.childRepository.remove(childId);
  }

  async accessChild(parentId: string, childId: string, accessChildDto: AccessChildDto): Promise<Child> {
    const child = await this.findOwnedChildOrFail(parentId, childId);

    if(!child.pin) return child;

    if (!accessChildDto.pin || accessChildDto.pin !== child.pin) {
      throw new UnauthorizedException('Pin required or incorrect');
    }

    return child;
  }

  private async findOwnedChildOrFail(parentId: string, childId: string): Promise<Child> {
    const child = await this.childRepository.findById(childId);

    if(!child || child.parentId !== parentId) {
      throw new NotFoundException('Child not found');
    }

    return child;
  }
}
