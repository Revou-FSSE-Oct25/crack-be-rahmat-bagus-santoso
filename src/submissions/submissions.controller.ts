import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../utils/types/authenticated.request';
import { SubmissionsService } from './submissions.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@ApiTags('Submissions')
@ApiBearerAuth('authBearer')
@Roles(Role.PARENT)
@Controller('children/:childId/lessons/:lessonId/quizzes/:quizId')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @ApiOperation({ summary: 'Submit a quiz answer for a child' })
  @Post('submit')
  submit(
    @Req() request: AuthenticatedRequest,
    @Param('childId') childId: string,
    @Param('lessonId') lessonId: string,
    @Param('quizId') quizId: string,
    @Body() submitQuizDto: SubmitQuizDto,
  ) {
    return this.submissionsService.submit(
      request.user.userId,
      childId,
      lessonId,
      quizId,
      submitQuizDto,
    );
  }
}
