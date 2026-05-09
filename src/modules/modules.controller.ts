import { Controller, Get, Param } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';


@ApiTags('Modules')
@Public()
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @ApiOperation({ summary: 'Get all modules'})
  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @ApiOperation({ summary: 'Get module detail by id'})
  @Get(':moduleId')
  findOne(@Param('moduleId') moduleId: string) {
    return this.modulesService.findOne(moduleId);
  }

  @ApiOperation({ summary: 'Get lessons by module id'})
  @Get(':moduleId/lessons')
  findLessonByModule(@Param('moduleId') moduleId: string) {
    return this.modulesService.findLessonsByModule(moduleId);
  }

}
