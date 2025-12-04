/**
 * =====================================================
 * 更新订阅数据传输对象 (Update Subscription DTO)
 * =====================================================
 * 
 * @description
 * 定义更新订阅请求的数据结构和验证规则
 * 
 * @validation
 * - status: 可选，枚举类型，订阅状态
 * - quantity: 可选，数字类型，订阅数量
 * - planId: 可选，字符串类型，订阅计划 ID
 * - metadata: 可选，对象类型，附加元数据
 * 
 * @subscription_statuses
 * - ACTIVE: 活跃
 * - INACTIVE: 未激活
 * - CANCELLED: 已取消
 * - EXPIRED: 已过期
 * 
 * @example
 * ```json
 * {
 *   "status": "CANCELLED",
 *   "metadata": {
 *     "cancellationReason": "Cost too high"
 *   }
 * }
 * ```
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

/**
 * 订阅状态枚举
 */
enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export class UpdateSubscriptionDto {
  /** 订阅状态 */
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  /** 订阅数量 */
  @IsOptional()
  @IsNumber()
  quantity?: number;

  /** 订阅计划 ID */
  @IsOptional()
  @IsString()
  planId?: string;

  /** 附加元数据 */
  @IsOptional()
  metadata?: Record<string, any>;
}
