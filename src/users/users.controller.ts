import { Controller, Get, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsersService, SafeUser } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/utils/types/authenticated.request';

@ApiTags('User')
@ApiBearerAuth('authBearer')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({summary: 'Get profile for current user'})
  @Get('profile')
  async getProfile(@Req() request: AuthenticatedRequest): Promise<SafeUser> {
    return this.usersService.findOne(request.user.userId);
  }

  @ApiOperation({summary: 'Update profile for current user'})
  @Patch('profile')
  async updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto): Promise<SafeUser> {
    return this.usersService.update(request.user.userId, updateUserDto);
  }

  @ApiOperation({summary: 'Delete user'})
  @Delete('delete')
  async remove(@Req() request: AuthenticatedRequest): Promise<SafeUser> {
    return this.usersService.remove(request.user.userId);
  }
}
