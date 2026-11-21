import * as assert from 'node:assert';
import { test, describe } from 'node:test';
import { AuthService } from './auth.service';

describe('AuthService unit checks', () => {
  const dummyPrisma = {} as any;
  const dummyJwt = {
    signAsync: async () => 'mock_token',
  } as any;
  const dummyConfig = {
    get: (key: string, def: string) => def,
  } as any;

  const authService = new AuthService(dummyPrisma, dummyJwt, dummyConfig);

  test('sanitizeUser should strip passwordHash from output', () => {
    const rawUser = {
      id: '123',
      email: 'test@example.com',
      passwordHash: '$2b$12$somehash',
      role: 'USER',
      status: 'ACTIVE',
    };

    const sanitized = authService.sanitizeUser(rawUser);
    assert.strictEqual(sanitized.id, '123');
    assert.strictEqual(sanitized.email, 'test@example.com');
    assert.strictEqual('passwordHash' in sanitized, false);
  });
});
