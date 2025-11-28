import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get<T = string>(key: string, defaultValue?: T): T | undefined {
    const val = process.env[key];
    return (val ?? defaultValue) as unknown as T;
  }
}