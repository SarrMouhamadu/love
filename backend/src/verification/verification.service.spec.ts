import * as assert from 'node:assert';
import { test, describe } from 'node:test';
import { VerificationService } from './verification.service';

describe('VerificationService unit checks', () => {
  const dummyPrisma = {} as any;
  const verificationService = new VerificationService(dummyPrisma);

  test('generateInstructions should return 2 distinct selfie challenges and a 20s voice phrase', () => {
    const instructions = verificationService.generateInstructions();

    assert.ok(instructions.selfie1Instruction);
    assert.ok(instructions.selfie2Instruction);
    assert.notStrictEqual(instructions.selfie1Instruction, instructions.selfie2Instruction);
    assert.ok(instructions.voicePhrase.includes('Anonyme Pro'));
    assert.strictEqual(instructions.voiceDurationSeconds, 20);
  });
});
