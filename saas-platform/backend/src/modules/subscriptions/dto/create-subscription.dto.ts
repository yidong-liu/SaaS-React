/**
 * =====================================================
 * 创建订阅数据传输对象 (Create Subscription DTO)
 * =====================================================
 * 
 * @description
 * 定义创建订阅请求的数据结构和验证规则
 * 
 * @validation
 * - planId: 必填，字符串类型，订阅计划 ID
 * - userId: 必填，字符串类型，用户 ID
 * - quantity: 可选，数字类型，订阅数量
 * - metadata: 可选，对象类型，附加元数据
 * 
 * @example
 * ```json
 * {
 *   "planId": "plan-premium-monthly",
 *   "userId": "user-123",
 *   "quantity": 5,
 *   "metadata": {
 *     "source": "website",
 *     "campaign": "summer-sale"
 *   }
 * }
 * ```
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  /** 订阅计划 ID */
  @IsString()
  @IsNotEmpty()
  planId: string;

  /** 用户 ID */
  @IsString()
  @IsNotEmpty()
  userId: string;

  /** 订阅数量（可选，默认 1） */
  @IsOptional()
  @IsNumber()
  quantity?: number;

  /** 附加元数据（可选） */
  @IsOptional()
  metadata?: Record<string, any>;
}
