import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Quizzes')
@ApiBearerAuth('authBearer')
@Controller('quizzes')
export class QuizzesController {}
