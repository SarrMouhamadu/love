import * as assert from 'node:assert';
import { test, describe } from 'node:test';
import { PaymentService } from './payment.service';

describe('PaymentService unit checks', () => {
  const dummyPrisma = {} as any;
  const dummyConfig = {
    get: (key: string, def?: string) => def,
  } as any;

  const paymentService = new PaymentService(dummyPrisma, dummyConfig);

  test('computeNewExpiry should add 30 days to now if no current expiry', () => {
    const now = new Date();
    const expiry = paymentService.computeNewExpiry(null, 30);

    const diffDays = Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    assert.strictEqual(diffDays, 30);
  });

  test('computeNewExpiry should extend future expiry by 30 days', () => {
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
    const extendedExpiry = paymentService.computeNewExpiry(futureDate, 30);

    const diffDays = Math.round((extendedExpiry.getTime() - futureDate.getTime()) / (1000 * 60 * 60 * 24));
    assert.strictEqual(diffDays, 30);
  });
});
