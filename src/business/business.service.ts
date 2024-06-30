import { Inject, Injectable } from '@nestjs/common';
import { BusinessRepository } from './business.repository';
import { BusinessToken } from './business.token';
import { CreateBusinessDto } from './dto/business.dto';
import { success } from 'src/common/types/response.type';

@Injectable()
export class BusinessService {
  constructor(
    @Inject(BusinessToken.BusinessRepository)
    private businessRepository: BusinessRepository,
  ) {}

  async createBusiness(dto: CreateBusinessDto, userId: string) {
    const business = await this.businessRepository.create({
      ...dto,
      userId,
    });
    return success('business created successfully', business);
  }

  async getUserBusinesses(userId: string) {
    const businesses = await this.businessRepository.find({ userId });
    return success('businesses fetched successfully', businesses);
  }
}
