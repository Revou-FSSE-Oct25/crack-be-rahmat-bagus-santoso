import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../utils/types/authenticated.request';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { AccessChildDto } from './dto/access-child.dto';

@ApiTags('Children')
@ApiBearerAuth('authBearer')
@Roles(Role.PARENT)
@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @ApiOperation({ summary: 'Create a child profile by current parent' })
  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createChildDto: CreateChildDto,
  ) {
    return this.childrenService.create(request.user.userId, createChildDto);
  }

  @ApiOperation({ summary: 'Get all children profile owned by current parent' })
  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.childrenService.findAllByParent(request.user.userId);
  }

  @ApiOperation({ summary: 'Get child profile detail owned by current parent' })
  @Get(':childId')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('childId') childId: string,
  ) {
    return this.childrenService.findOneByParent(request.user.userId, childId);
  }

  @ApiOperation({ summary: 'Get all module progress for child' })
  @Get(':childId/progress')
  getProgress(@Req() request: AuthenticatedRequest, @Param('childId') childId: string) {
    return this.childrenService.getChildProgress(request.user.userId, childId);
  }

  @ApiOperation({ summary: 'Update child profile owned by current parent' })
  @Patch(':childId')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('childId') childId: string,
    @Body() updateChildDto: UpdateChildDto,
  ) {
    return this.childrenService.update(
      request.user.userId,
      childId,
      updateChildDto,
    );
  }

  @ApiOperation({ summary: 'Delete child profile owned by current parent' })
  @Delete(':childId')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('childId') childId: string,
  ) {
    return this.childrenService.remove(
      request.user.userId, 
      childId);
  }

  @ApiOperation({ summary: 'Access for child' })
  @Post(':childId/access')
  grantAccess(
    @Req() request: AuthenticatedRequest,
    @Param('childId') childId: string,
    @Body() accessChildDto: AccessChildDto,
  ) {
    return this.childrenService.accessChild(
      request.user.userId,
      childId,
      accessChildDto,
    );
  }

  @ApiOperation({ summary: 'Get quizzes for selected child lesson' })
  @Get(':childId/lessons/:lessonId/quizzes')
  findQuizzesForLearning(
    @Req() request: AuthenticatedRequest,
    @Param('childId') childId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.childrenService.findQuizzesForLearning(
      request.user.userId,
      childId,
      lessonId,
    );
  }
}
