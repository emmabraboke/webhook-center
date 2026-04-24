export const sourceExample = {
  id: 'src1a2b3-d4e5-7890-abcd-ef1234567890',
  projectId: 'p1q2r3s4-t5u6-7890-abcd-ef1234567890',
  name: 'Stripe Production',
  ingestKey: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  createdAt: '2026-01-15T10:00:00.000Z',
};

export const eventExample = {
  id: 'ev1a2b3c-d4e5-7890-abcd-ef1234567890',
  projectId: 'p1q2r3s4-t5u6-7890-abcd-ef1234567890',
  eventType: 'payment.success',
  payload: { amount: 1000, currency: 'USD', customerId: 'cus_123' },
  createdAt: '2026-01-15T10:00:00.000Z',
};

export const endpointExample = {
  id: 'ep1a2b3c-d4e5-7890-abcd-ef1234567890',
  projectId: 'p1q2r3s4-t5u6-7890-abcd-ef1234567890',
  name: 'My Server',
  url: 'https://myapp.com/webhooks',
  status: 'active',
  maxRetries: 3,
  secret: 'whsec_abc123xyz',
  createdAt: '2026-01-15T10:00:00.000Z',
};

export const subscriptionExample = {
  id: 'sb1a2b3c-d4e5-7890-abcd-ef1234567890',
  name: 'Payments Delivery',
  sourceId: 'src1a2b3-d4e5-7890-abcd-ef1234567890',
  endpointId: 'ep1a2b3c-d4e5-7890-abcd-ef1234567890',
  createdAt: '2026-01-15T10:00:00.000Z',
};

export const deliveryExample = {
  id: 'dl1a2b3c-d4e5-7890-abcd-ef1234567890',
  eventId: 'ev1a2b3c-d4e5-7890-abcd-ef1234567890',
  endpointId: 'ep1a2b3c-d4e5-7890-abcd-ef1234567890',
  status: 'delivered',
  nextRetryAt: null,
  createdAt: '2026-01-15T10:00:00.000Z',
};

export const attemptExample = {
  id: 'at1a2b3c-d4e5-7890-abcd-ef1234567890',
  deliveryId: 'dl1a2b3c-d4e5-7890-abcd-ef1234567890',
  statusCode: 200,
  responseBody: '{"received":true}',
  duration: 142,
  createdAt: '2026-01-15T10:00:00.000Z',
};
