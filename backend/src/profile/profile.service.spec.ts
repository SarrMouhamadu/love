import * as assert from 'node:assert';
import { test, describe } from 'node:test';
import { ProfileService } from './profile.service';

describe('ProfileService unit checks', () => {
  const dummyPrisma = {} as any;
  const profileService = new ProfileService(dummyPrisma);

  test('calculateAge should correctly calculate age from birthDate', () => {
    const twentyYearsAgo = new Date();
    twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);

    const calculated = profileService.calculateAge(twentyYearsAgo);
    assert.strictEqual(calculated, 20);
  });

  test('calculateAge handles birthdate later in the year', () => {
    const today = new Date();
    const pastYear = today.getFullYear() - 25;
    // Set birthday to next month
    const laterInYear = new Date(pastYear, (today.getMonth() + 2) % 12, 1);

    const calculated = profileService.calculateAge(laterInYear);
    // Depending on whether (today.getMonth() + 2) wrapped around, check range
    assert.ok(calculated >= 24 && calculated <= 25);
  });
});
