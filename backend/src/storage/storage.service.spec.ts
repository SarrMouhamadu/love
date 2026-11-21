import * as assert from 'node:assert';
import { test, describe } from 'node:test';
import { StorageService } from './storage.service';

describe('StorageService unit checks', () => {
  const dummyConfig = {
    get: (key: string, def?: any) => {
      if (key === 'STORAGE_REGION') return 'us-east-1';
      if (key === 'STORAGE_BUCKET') return 'test-bucket';
      return undefined;
    },
  } as any;

  const storageService = new StorageService(dummyConfig);

  test('getPresignedUploadUrl returns local fallback mode when S3 credentials not set', async () => {
    const result = await storageService.getPresignedUploadUrl('user-123', {
      fileName: 'selfie 1.jpg',
      fileType: 'image/jpeg',
      folder: 'verification',
    });

    assert.strictEqual(result.mode, 'local');
    assert.ok(result.uploadUrl.includes('/api/v1/storage/upload'));
    assert.ok(result.key.includes('verification/user-123/'));
    assert.ok(result.key.includes('selfie_1.jpg'));
  });
});
