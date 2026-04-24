export const deliveryExample = {
  id: 'del_123',
  eventId: 'evt_123',
  endpointId: 'ep_123',
  status: 'delivered',
  retries: 0,
  nextRetry: null,
  createdAt: '2026-04-24T10:00:00Z',
  updatedAt: '2026-04-24T10:00:05Z',
};

export const attemptExample = {
  id: 'att_123',
  eventDeliveryId: 'del_123',
  statusCode: 200,
  responseBody: '{"success":true}',
  error: null,
  duration: 145,
  createdAt: '2026-04-24T10:00:05Z',
};
