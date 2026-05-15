import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LessonsService } from '../lessons/lessons.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { ProgressService } from '../progress/progress.service';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { ChildrenRepository } from './children.repository';
import { Child } from './entities/child.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { AccessChildDto } from './dto/access-child.dto';

export type SafeChild = Omit<Child, 'pin'>;

@Injectable()
export class ChildrenService {
  constructor(
    private readonly childRepository: ChildrenRepository,
    private readonly lessonsService: LessonsService,
    private readonly quizzesService: QuizzesService,
    private readonly progressService: ProgressService,
  ) {}

  async create(
    parentId: string,
    createChildDto: CreateChildDto,
  ): Promise<SafeChild> {
    const childData: Prisma.ChildCreateInput = {
      ...createChildDto,
      parent: {
        connect: {
          id: parentId,
        },
      },
    };

    const createdChild = await this.childRepository.create(childData);

    return this.toSafeChild(createdChild);
  }

  async findAllByParent(parentId: string): Promise<SafeChild[]> {
    const children = await this.childRepository.findManyByParentId(parentId);
    return children.map((child) => this.toSafeChild(child));
  }

  async findOneByParent(parentId: string, childId: string): Promise<SafeChild> {
    const child = await this.findOwnedChildOrFail(parentId, childId);
    return this.toSafeChild(child);
  }

  async update(
    parentId: string,
    childId: string,
    updateChildDto: UpdateChildDto,
  ): Promise<SafeChild> {
    await this.findOwnedChildOrFail(parentId, childId);

    const childData: Prisma.ChildUpdateInput = {
      ...updateChildDto,
    };

    const updatedChild = await this.childRepository.update(childId, childData);

    return this.toSafeChild(updatedChild);
  }

  async remove(parentId: string, childId: string): Promise<SafeChild> {
    await this.findOwnedChildOrFail(parentId, childId);

    const deletedChild = await this.childRepository.remove(childId);

    return this.toSafeChild(deletedChild);
  }

  async accessChild(
    parentId: string,
    childId: string,
    accessChildDto: AccessChildDto,
  ): Promise<SafeChild> {
    const child = await this.findOwnedChildOrFail(parentId, childId);

    if (!child.pin) {
      return this.toSafeChild(child);
    }

    if (!accessChildDto.pin || accessChildDto.pin !== child.pin) {
      throw new UnauthorizedException('Pin required or incorrect');
    }

    return this.toSafeChild(child);
  }

  async findQuizzesForLearning(
    parentId: string,
    childId: string,
    lessonId: string,
  ): Promise<Quiz[]> {
    await this.findOwnedChildOrFail(parentId, childId);
    const lesson = await this.lessonsService.findOne(lessonId);
    const quizzes = await this.quizzesService.findAllForChildByLesson(lesson.id);

    return quizzes;
  }

  async getChildProgress(parentId: string, childId: string) {
    await this.findOwnedChildOrFail(parentId, childId);
    return this.progressService.getProgressByChild(childId);
  }

  private async findOwnedChildOrFail(
    parentId: string,
    childId: string,
  ): Promise<Child> {
    const child = await this.childRepository.findById(childId);

    if (!child || child.parentId !== parentId) {
      throw new NotFoundException('Child not found');
    }

    return child;
  }

  private toSafeChild(child: Child) {
    const { pin: _pin, ...safeChild } = child;
    return safeChild;
  }
}
