/**
 * =====================================================
 * 订阅实体 (Subscription Entity)
 * =====================================================
 * 
 * @description
 * 定义订阅数据模型的接口
 * 
 * @properties
 * - id: 订阅唯一标识符
 * - userId: 用户 ID
 * - planId: 订阅计划 ID
 * - status: 订阅状态
 * - quantity: 订阅数量
 * - startDate: 订阅开始日期
 * - endDate: 订阅结束日期
 * - createdAt: 创建时间
 * - updatedAt: 更新时间
 * - metadata: 附加元数据
 * 
 * @lifecycle
 * startDate -> Active Period -> endDate -> (Renew or Expire)
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

export interface Subscription {
  /** 订阅 ID */
  id: string;
  
  /** 用户 ID */
  userId: string;
  
  /** 订阅计划 ID */
  planId: string;
  
  /** 订阅状态 */
  status: string;
  
  /** 订阅数量 */
  quantity?: number;
  
  /** 开始日期 */
  startDate: Date;
  
  /** 结束日期 */
  endDate: Date;
  
  /** 创建时间 */
  createdAt: Date;
  
  /** 更新时间 */
  updatedAt: Date;
  
  /** 附加元数据 */
  metadata?: Record<string, any>;
}
