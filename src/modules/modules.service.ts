import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LessonsService } from '../lessons/lessons.service';
import { Lesson } from '../lessons/entities/lesson.entity';
import { ModulesRepository } from './modules.repository';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module } from './entities/module.entity';

@Injectable()
export class ModulesService {
  constructor(
    private readonly modulesRepository: ModulesRepository,
    private readonly lessonsService: LessonsService,
  ) {}

  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    await this.ensureModuleTitleAvailable(createModuleDto.title);
    const data: Prisma.ModuleCreateInput = { 
      ...createModuleDto
    };
    return this.modulesRepository.create(data);
  }

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

  async update(moduleId: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    await this.findExistingModuleOrFail(moduleId);
    
    if(updateModuleDto.title !== undefined) {
      await this.ensureModuleTitleAvailable(updateModuleDto.title, moduleId);
    }

    const data: Prisma.ModuleUpdateInput = {
      ...updateModuleDto
    }
    return this.modulesRepository.update(moduleId, data);
  }

  async remove(moduleId: string): Promise<Module> {
    await this.findExistingModuleOrFail(moduleId)
    return this.modulesRepository.remove(moduleId);
  }

  private async ensureModuleTitleAvailable(title: string, excludeModuleId?: string): Promise<void> {
    const existing = await this.modulesRepository.findByTitle(title);
    if(existing && existing.id !== excludeModuleId) {
      throw new ConflictException( `Module with title "${title}" already exist` );
    }
  }

  private async findExistingModuleOrFail(moduleId: string): Promise<Module> {
    const module = await this.modulesRepository.findById(moduleId);

    if(!module) {
      throw new NotFoundException('Module not found');
    }
    return module;
  }
}
