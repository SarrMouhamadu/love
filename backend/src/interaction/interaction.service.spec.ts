import * as assert from 'node:assert';
import { test, describe } from 'node:test';
import { InteractionService } from './interaction.service';

describe('InteractionService unit checks', () => {
  const dummyPrisma = {} as any;
  const service = new InteractionService(dummyPrisma);

  test('calculateDistance should accurately calculate distance in km between Dakar and Thies', () => {
    // Dakar coords: 14.7167, -17.4677
    // Thies coords: 14.7903, -16.9260
    // Distance approx: ~58-62 km
    const dist = service.calculateDistance(14.7167, -17.4677, 14.7903, -16.9260);
    assert.ok(dist >= 55 && dist <= 65, `Expected ~60km, got ${dist}`);
  });

  test('calculateDistance returns 0 for same point', () => {
    const dist = service.calculateDistance(14.7167, -17.4677, 14.7167, -17.4677);
    assert.strictEqual(dist, 0);
  });
});
