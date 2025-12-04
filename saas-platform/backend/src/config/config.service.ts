/**
 * =====================================================
 * 配置服务 (Configuration Service)
 * =====================================================
 * 
 * @description
 * 提供统一的配置访问接口，封装环境变量的读取逻辑
 * 
 * @responsibilities
 * - 读取环境变量
 * - 提供类型安全的配置访问
 * - 支持默认值设置
 * 
 * @example
 * ```typescript
 * const dbUrl = configService.get('DATABASE_URL', 'localhost:5432');
 * const port = configService.get<number>('PORT', 3000);
 * ```
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  /**
   * 获取配置值
   * @param key - 配置键名（环境变量名）
   * @param defaultValue - 默认值（可选）
   * @returns 配置值或默认值
   * 
   * @example
   * ```typescript
   * const apiKey = configService.get('API_KEY', 'default-key');
   * ```
   */
  get<T = string>(key: string, defaultValue?: T): T | undefined {
    const val = process.env[key];
    return (val ?? defaultValue) as unknown as T;
  }
}