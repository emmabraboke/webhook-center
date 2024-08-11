import { BusinessModel } from 'src/database/models';
import { CreateBusinessDto } from '../dto/business.dto';
import { SuccessResponse } from 'src/common/types/response.type';

export interface BusinessServiceInterface {
  createBusiness(
    dto: CreateBusinessDto,
    userId: string,
  ): Promise<SuccessResponse<BusinessModel>>;
  getUserBusinesses(userId: string): Promise<SuccessResponse<BusinessModel[]>>;
}
