import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { ModulesService } from '../modules/modules.service';
import { LessonsService } from '../lessons/lessons.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { BadgesService } from '../badges/badges.service';
import { CreateModuleDto } from '../modules/dto/create-module.dto';
import { UpdateModuleDto } from '../modules/dto/update-module.dto';
import { CreateLessonDto } from '../lessons/dto/create-lesson.dto';
import { UpdateLessonDto } from '../lessons/dto/update-lesson.dto';
import { CreateQuizDto } from '../quizzes/dto/create-quiz.dto';
import { UpdateQuizDto } from '../quizzes/dto/update-quiz.dto';
import { CreateBadgeDto } from '../badges/dto/create-badge.dto';
import { UpdateBadgeDto } from '../badges/dto/update-badge.dto';

@ApiTags('Admin')
@ApiBearerAuth('authBearer')
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly modulesService: ModulesService,
    private readonly lessonsService: LessonsService,
    private readonly quizzesService: QuizzesService,
    private readonly badgesService: BadgesService,
  ) {}

  // Modules
  @ApiOperation({ summary: 'Create a new module' })
  @Post('modules')
  createModule(@Body() createAdminDto: CreateModuleDto) {
    return this.modulesService.create(createAdminDto);
  }

  @ApiOperation({ summary: 'Update a module' })
  @Patch('modules/:moduleId')
  updateModule(@Param('moduleId') moduleId: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(moduleId, updateModuleDto)
  }

  @ApiOperation({ summary: 'Delete a module and all its contents' })
  @Delete('modules/:moduleId')
  removeModule(@Param('moduleId') moduleId: string) {
    return this.modulesService.remove(moduleId)
  }

  // Lessons
  @ApiOperation({ summary: 'Create a lesson in a module'})
  @Post('modules/:moduleId/lessons')
  createLesson(@Param('moduleId') moduleId: string, @Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(moduleId, createLessonDto);
  }

  @ApiOperation({ summary: 'Update a lesson' })
  @Patch('lessons/:lessonId')
  updateLesson(@Param('lessonId') lessonId: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(lessonId, updateLessonDto);
  }
  @ApiOperation({ summary: 'Delete a lesson and all its quizzes' })
  @Delete('lessons/:lessonId')
  removeLesson(@Param('lessonId') lessonId: string) {
    return this.lessonsService.remove(lessonId);
  }
  
  // Quizzes
  @ApiOperation({ summary: 'Create a quiz with options in a lesson' })
  @Post('lessons/:lessonId/quizzes')
  createQuiz(@Param('lessonId') lessonId: string, @Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(lessonId, createQuizDto);
  }
  @ApiOperation({ summary: 'Update a quiz, include options to replace them' })
  @Patch('quizzes/:quizId')
  updateQuiz(@Param('quizId') quizId: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(quizId, updateQuizDto);
  }
  @ApiOperation({ summary: 'Delete a quiz' })
  @Delete('quizzes/:quizId')
  removeQuiz(@Param('quizId') quizId: string) {
    return this.quizzesService.remove(quizId);
  }

  // Badges
  @ApiOperation({ summary: 'Create a badge for a module, one per module' })
  @Post('modules/:moduleId/badge')
  createBadge(@Param('moduleId') moduleId: string, @Body() createBadgeDto: CreateBadgeDto) {
    return this.badgesService.create(moduleId, createBadgeDto);
  }
  @ApiOperation({ summary: 'Update a badge' })
  @Patch('badges/:badgeId')
  updateBadge(@Param('badgeId') badgeId: string, @Body() updateBadgeDto: UpdateBadgeDto) {
    return this.badgesService.update(badgeId, updateBadgeDto);
  }
  @ApiOperation({ summary: 'Delete a badge' })
  @Delete('badges/:badgeId')
  removeBadge(@Param('badgeId') badgeId: string) {
    return this.badgesService.remove(badgeId);
  }
}
