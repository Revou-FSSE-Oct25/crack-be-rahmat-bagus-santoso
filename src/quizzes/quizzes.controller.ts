import { Controller, Get, Param } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Quizzes')
@ApiBearerAuth('authBearer')
@Controller('lessons')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @ApiOperation({ summary: 'Get quizzes by lesson id' })
  @Get(':lessonId/quizzes')
  findAll(@Param('lessonId') lessonId: string) {
    return this.quizzesService.findAllByLesson(lessonId);
  }
}
