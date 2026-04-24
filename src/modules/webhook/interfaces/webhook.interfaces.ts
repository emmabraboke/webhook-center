import { EndpointStatus } from '@prisma/client';

export interface CreateEndpointData {
  projectId: string;
  name: string;
  url: string;
  secret: string;
  maxRetries?: number;
  customHeaders?: Record<string, string> | null;
}

export interface UpdateEndpointData {
  name?: string;
  url?: string;
  status?: EndpointStatus;
  maxRetries?: number;
  customHeaders?: Record<string, string> | null;
}
