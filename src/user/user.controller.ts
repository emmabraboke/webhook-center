import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserQueryDto } from './dto/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { RolesGuard } from 'src/common/guard/user.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRoles } from 'src/common/enum/role.enum';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles([UserRoles.Admin, UserRoles.User])
  @Get('')
  getUsers(@Query() dto: GetUserQueryDto) {
    return this.userService.getUsers(dto);
  }
}
