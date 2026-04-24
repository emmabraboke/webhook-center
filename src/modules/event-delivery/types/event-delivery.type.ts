import { Prisma } from '@prisma/client';

export type EventDeliveryWithRelations = Prisma.EventDeliveryGetPayload<{
  include: {
    event: true;
    endpoint: true;
  };
}>;
