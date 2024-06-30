import { BaseModel } from './base.model';

export class WebhookEventModel extends BaseModel {
  static tableName = 'webhook_events';

  retries: number;
  next_retry: string;
  payload: object;
  headers: object;
  status: string;
  endpoint_id: string;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        retries: { type: 'number' },
        next_retry: { type: 'string' },
        payload: { type: 'object' },
        headers: { type: 'object' },
        status: { type: 'string' },
        endpoint_id: { type: 'string' },
      },
    };
  }
}
