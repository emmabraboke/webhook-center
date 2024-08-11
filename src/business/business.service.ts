import { Inject, Injectable } from '@nestjs/common';
import { BusinessRepository } from './business.repository';
import { BusinessToken } from './business.token';
import { CreateBusinessDto } from './dto/business.dto';
import { success, SuccessResponse } from 'src/common/types/response.type';
import { BusinessServiceInterface } from './interfaces/business.interface';
import { BusinessModel } from 'src/database/models';

@Injectable()
export class BusinessService implements BusinessServiceInterface {
  constructor(
    @Inject(BusinessToken.BusinessRepository)
    private businessRepository: BusinessRepository,
  ) {}

  async createBusiness(
    dto: CreateBusinessDto,
    userId: string,
  ): Promise<SuccessResponse<BusinessModel>> {
    const business = await this.businessRepository.create({
      ...dto,
      userId,
    });
    return success('business created successfully', business);
  }

  async getUserBusinesses(
    userId: string,
  ): Promise<SuccessResponse<BusinessModel[]>> {
    const businesses = await this.businessRepository.find({ userId });
    return success('businesses fetched successfully', businesses);
  }
}
