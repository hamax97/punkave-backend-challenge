import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DBUri {
  public readonly uri: string;

  constructor(private readonly env: ConfigService) {
    const username = env.get('MONGODB_USERNAME');
    const password = env.get('MONGODB_PASSWORD');
    const host = env.get('MONGODB_HOST');
    const dbname = env.get('MONGODB_DBNAME');

    this.uri = `mongodb+srv://${username}:${password}@${host}/${dbname}`;
  }
}
