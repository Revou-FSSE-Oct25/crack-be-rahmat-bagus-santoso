import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ModulesService } from './modules.service';

@ApiTags('Modules')
@Public()
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @ApiOperation({ summary: 'Get all modules'})
  @ApiQuery({ name: 'search', required: false, description: 'Filter module by title'})
  @Get()
  findAll(@Query('search') search?: string) {
    return this.modulesService.findAll(search);
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
