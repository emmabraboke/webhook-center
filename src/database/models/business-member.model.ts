import { BaseModel } from './base.model';

export class BusinessMemberModel extends BaseModel {
  static tableName = 'business_members';

  userId: string;
  businessId: string;
  role: string;
}
