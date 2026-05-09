import { Injectable, NotFoundException } from '@nestjs/common';
import { ModulesRepository } from './modules.repository';
import { Module } from './entities/module.entity';
import { LessonsService } from '../lessons/lessons.service';
import { Lesson } from '../lessons/entities/lesson.entity';

@Injectable()
export class ModulesService {
  constructor(
    private readonly modulesRepository: ModulesRepository,
    private readonly lessonsService: LessonsService,
  ) {}
  // create(createModuleDto: CreateModuleDto) {
  //   return 'This action adds a new module';
  // }

  async findAll(): Promise<Module[]> {
    return this.modulesRepository.findAll();
  }

  async findOne(moduleId: string): Promise<Module> {
    return this.findExistingModuleOrFail(moduleId);
  }

  async findLessonsByModule(moduleId: string): Promise<Lesson[]> {
    await this.findExistingModuleOrFail(moduleId);

    return this.lessonsService.findAllByModule(moduleId);
  }

  // update(id: number, updateModuleDto: UpdateModuleDto) {
  //   return `This action updates a #${id} module`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} module`;
  // }

  private async findExistingModuleOrFail(moduleId: string): Promise<Module> {
    const module = await this.modulesRepository.findById(moduleId);

    if(!module) {
      throw new NotFoundException('Module not found');
    }
    return module;
  }
}
