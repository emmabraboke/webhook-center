import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { ApiCreatedResponse, ApiSuccessResponse } from 'src/common/swagger/api-responses';
import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
import { businessExample } from './business.examples';

@ApiTags('Business')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiOperation({ summary: 'Create a new business' })
  @ApiCreatedResponse('business created successfully', businessExample)
  @Post()
  createBusiness(@Body() dto: CreateBusinessDto, @CurrentUser() user: { id: string }) {
    return this.businessService.createBusiness(dto, user.id);
  }

  @ApiOperation({ summary: 'Get all businesses for the authenticated user' })
  @ApiSuccessResponse('businesses fetched successfully', [businessExample])
  @Get()
  getUserBusinesses(@CurrentUser() user: { id: string }) {
    return this.businessService.getUserBusinesses(user.id);
  }

  @ApiOperation({ summary: 'Get a business by ID' })
  @ApiSuccessResponse('business fetched successfully', businessExample)
  @Get(':id')
  getBusinessById(@Param('id') id: string) {
    return this.businessService.getBusinessById(id);
  }

  @ApiOperation({ summary: 'Update a business' })
  @ApiSuccessResponse('business updated successfully', { ...businessExample, name: 'Acme Corp Updated' })
  @Patch(':id')
  updateBusiness(@Param('id') id: string, @Body() dto: UpdateBusinessDto) {
    return this.businessService.updateBusiness(id, dto);
  }

  @ApiOperation({ summary: 'Delete a business' })
  @ApiSuccessResponse('business deleted successfully')
  @Delete(':id')
  deleteBusiness(@Param('id') id: string) {
    return this.businessService.deleteBusiness(id);
  }
}
