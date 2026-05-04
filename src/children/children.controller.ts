import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../utils/types/authenticated.request';
import { AccessChildDto } from './dto/access-child.dto';

@ApiTags("Children")
@ApiBearerAuth('authBearer')
@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @ApiOperation({ summary: 'Create child for current parent'})
  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createChildDto: CreateChildDto) {
    return this.childrenService.create(request.user.userId, createChildDto);
  }

  @ApiOperation({ summary: 'Get all children for current parent'})
  @Get()
  findAll(@Req() request: AuthenticatedRequest,) {
    return this.childrenService.findAllByParent(request.user.userId);
  }

  @ApiOperation({ summary: 'Get child detail for current parent'})
  @Get(':childId')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('childId') childId: string) {
    return this.childrenService.findOneByParent(request.user.userId, childId);
  }

  @ApiOperation({ summary: 'Update child for current parent'})
  @Patch(':childId')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('childId') childId: string, @Body() updateChildDto: UpdateChildDto) {
    return this.childrenService.update(request.user.userId, childId, updateChildDto);
  }

  @ApiOperation({ summary: 'Delete child for current parent'})
  @Delete(':childId')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('childId') childId: string) {
    return this.childrenService.remove(request.user.userId, childId);
  }

  @ApiOperation({ summary: 'Access for child'})
  @Post(':childId/access')
  grantAccess(
    @Req() request: AuthenticatedRequest,
    @Param('childId') childId: string,
    @Body() accessChildDto: AccessChildDto) {
      return this.childrenService.accessChild(request.user.userId, childId, accessChildDto);
    }
}
