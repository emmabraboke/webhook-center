import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { RolesGuard } from 'src/common/guard/user.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRoles } from 'src/common/enum/role.enum';
import { ApiPaginatedResponse, ApiSuccessResponse } from 'src/common/swagger/api-responses';
import { UserService } from './user.service';
import { GetUserQueryDto } from './dto/user.dto';
import { userExample } from './user.examples';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiSuccessResponse('profile fetched successfully', userExample)
  @Get('me')
  getMe(@CurrentUser('id') userId: string) {
    return this.userService.getMe(userId);
  }

  @ApiOperation({ summary: 'List all users' })
  @ApiPaginatedResponse('users fetched successfully', [userExample])
  @UseGuards(RolesGuard)
  @Roles([UserRoles.Admin, UserRoles.User])
  @Get('')
  getUsers(@Query() dto: GetUserQueryDto) {
    return this.userService.getUsers(dto);
  }
}
