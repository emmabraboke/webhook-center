import { BaseModel } from './base.model';

export class WebhookEndpointModel extends BaseModel {
  static tableName = 'webhook_endpoints';

  url: string;
  name: string;
  projectId: string;
}
