import { BaseModel } from './base.model';

export class BusinessMemberInviteModel extends BaseModel {
  static tableName = 'member_invites';
  senderId: string;
  businessId: string;
  email: string;
  accepted: boolean;
}
