import { Injectable, NotFoundException } from '@nestjs/common';
import { ModulesRepository } from './modules.repository';
import { Module } from './entities/module.entity';

@Injectable()
export class ModulesService {
  constructor(private readonly modulesRepository: ModulesRepository) {}
  // create(createModuleDto: CreateModuleDto) {
  //   return 'This action adds a new module';
  // }

  async findAll(): Promise<Module[]> {
    return this.modulesRepository.findAll();
  }

  async findOne(moduleId: string): Promise<Module> {
    const existingModule = await this.modulesRepository.findById(moduleId);

    if(!existingModule) {
      throw new NotFoundException('Module Not Found');
    }
    
    return existingModule;
  }

  // update(id: number, updateModuleDto: UpdateModuleDto) {
  //   return `This action updates a #${id} module`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} module`;
  // }
}
