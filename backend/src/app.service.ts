import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'Anonyme Pro Backend API',
      timestamp: new Date().toISOString(),
    };
  }
}
