import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { UserDto } from 'src/user/dto/user.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { CreateBusinessDto } from './dto/business.dto';

@ApiTags('Business')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('')
  createBusiness(@Body() dto: CreateBusinessDto, @CurrentUser() user: UserDto) {
    return this.businessService.createBusiness(dto, user.id);
  }
  @Get('/user')
  getUserBusinesses(@CurrentUser() user: UserDto) {
    return this.businessService.getUserBusinesses(user.id);
  }
}
