import { Model } from 'objection';

export class BaseModel extends Model {
  readonly id: string;
  createdAt: Date;
  updatedAt: Date;

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
