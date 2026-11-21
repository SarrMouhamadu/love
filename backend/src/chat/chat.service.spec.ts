import * as assert from 'node:assert';
import { test, describe } from 'node:test';
import { ChatService } from './chat.service';

describe('ChatService unit checks', () => {
  const dummyPrisma = {} as any;
  const chatService = new ChatService(dummyPrisma);

  test('sendMessage rejects empty message without content or attachments', async () => {
    await assert.rejects(
      async () => {
        await chatService.sendMessage('user-1', {
          conversationId: 'conv-1',
          content: '',
          attachments: [],
        });
      },
      {
        name: 'BadRequestException',
      },
    );
  });
});
