/**
 * =====================================================
 * 订阅服务 (Subscriptions Service)
 * =====================================================
 * 
 * @description
 * 订阅管理的核心业务逻辑服务
 * 
 * @responsibilities
 * - 创建新订阅
 * - 查询订阅信息
 * - 更新订阅状态
 * - 删除/取消订阅
 * 
 * @implementation_note
 * 当前使用内存存储（开发环境）
 * 生产环境应替换为 Prisma 数据库持久化
 * 
 * @business_rules
 * - 默认订阅期限: 30 天
 * - 默认订阅数量: 1
 * - 新订阅默认状态: ACTIVE
 * 
 * @todo
 * - [ ] 集成 Prisma 数据库
 * - [ ] 添加订阅到期检查
 * - [ ] 实现订阅续费逻辑
 * - [ ] 添加订阅事件通知
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  // 临时内存存储（开发环境）
  private subscriptions: Subscription[] = [];

  /**
   * 创建新订阅
   * @param createSubscriptionDto - 订阅创建数据
   * @returns 创建的订阅对象
   */
  create(createSubscriptionDto: CreateSubscriptionDto): Subscription {
    const newSubscription: Subscription = {
      id: (this.subscriptions.length + 1).toString(),
      userId: createSubscriptionDto.userId,
      planId: createSubscriptionDto.planId,
      status: 'ACTIVE',
      quantity: createSubscriptionDto.quantity || 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 天后
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: createSubscriptionDto.metadata,
    };
    this.subscriptions.push(newSubscription);
    return newSubscription;
  }

  /**
   * 获取所有订阅
   * @returns 订阅列表
   */
  findAll(): Subscription[] {
    return this.subscriptions;
  }

  /**
   * 根据 ID 查询订阅
   * @param id - 订阅 ID
   * @returns 订阅对象或 undefined
   */
  findOne(id: string): Subscription | undefined {
    return this.subscriptions.find((subscription) => subscription.id === id);
  }

  /**
   * 更新订阅信息
   * @param id - 订阅 ID
   * @param updateSubscriptionDto - 更新数据
   * @returns 更新后的订阅对象或 null
   */
  update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Subscription | null {
    const subscriptionIndex = this.subscriptions.findIndex(
      (subscription) => subscription.id === id
    );
    if (subscriptionIndex > -1) {
      const updated = {
        ...this.subscriptions[subscriptionIndex],
        ...updateSubscriptionDto,
        updatedAt: new Date(),
      };
      this.subscriptions[subscriptionIndex] = updated;
      return updated;
    }
    return null;
  }

  remove(id: string): Subscription[] | null {
    const subscriptionIndex = this.subscriptions.findIndex(
      (subscription) => subscription.id === id
    );
    if (subscriptionIndex > -1) {
      return this.subscriptions.splice(subscriptionIndex, 1);
    }
    return null;
  }
}
