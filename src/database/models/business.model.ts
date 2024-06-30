import { BaseModel } from './base.model';
import { UserModel } from './user.model';

export class BusinessModel extends BaseModel {
  static tableName = 'business';

  name: string;
  logo: string;
  userId: string;
  active: boolean;
  user: UserModel;

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'business.userId',
        to: 'users.id',
      },
    },
  };
}
