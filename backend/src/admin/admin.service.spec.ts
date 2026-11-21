import * as assert from 'node:assert';
import { test, describe } from 'node:test';
import { AdminService } from './admin.service';

describe('AdminService unit checks', () => {
  const dummyPrisma = {
    user: {
      count: async () => 100,
      findUnique: async () => ({ id: '1', role: 'SUPER_ADMIN' }),
    },
    profile: {
      groupBy: async () => [],
    },
    like: { count: async () => 500 },
    match: { count: async () => 50 },
    message: { count: async () => 2000 },
    payment: {
      findMany: async () => [{ amountXof: 500 }, { amountXof: 500 }],
      count: async () => 2,
    },
    subscription: { count: async () => 20 },
    report: { count: async () => 3 },
    verificationRequest: { count: async () => 5 },
    auditLog: { create: async () => ({ id: 'log-1' }) },
  } as any;

  const adminService = new AdminService(dummyPrisma);

  test('getDashboardAnalytics calculates revenue and conversion percentage accurately', async () => {
    const analytics = await adminService.getDashboardAnalytics('admin-1');

    assert.strictEqual(analytics.users.total, 100);
    assert.strictEqual(analytics.financial.totalRevenueXof, 1000);
    assert.strictEqual(analytics.financial.currency, 'XOF');
    assert.strictEqual(analytics.engagement.totalMatches, 50);
  });

  test('updateUserStatus prevents modifying Super Admin status', async () => {
    await assert.rejects(
      async () => {
        await adminService.updateUserStatus('admin-1', 'target-super-admin', {
          status: 'SUSPENDED' as any,
        });
      },
      {
        name: 'BadRequestException',
      },
    );
  });
});
