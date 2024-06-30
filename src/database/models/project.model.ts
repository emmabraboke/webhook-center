import { BaseModel } from './base.model';

export class ProjectModel extends BaseModel {
  static tableName = 'projects';

  name: string;
  description: string;
  userId: string;
  businessId: string;
}
