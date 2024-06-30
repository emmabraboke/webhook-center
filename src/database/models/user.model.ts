import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';

export class UserModel extends BaseModel {
  static tableName = 'users';

  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;
  profileImage: string;
  verified: boolean;
  role: string;
}
