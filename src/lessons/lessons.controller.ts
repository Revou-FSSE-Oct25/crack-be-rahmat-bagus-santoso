import { Controller, Get, Param } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Lessons')
@Public()
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiOperation({ summary: 'Get lesson detail by id '})
  @Get(':lessonId')
  findOne(@Param('lessonId') lessonId: string) {
    return this.lessonsService.findOne(lessonId);
  }
}
