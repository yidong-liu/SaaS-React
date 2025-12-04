/**
 * =====================================================
 * 订阅控制器 (Subscriptions Controller)
 * =====================================================
 * 
 * @description
 * 处理订阅管理相关的 HTTP 请求
 * 
 * @route /subscriptions
 * 
 * @endpoints
 * - POST /subscriptions - 创建订阅
 * - GET /subscriptions - 获取所有订阅
 * - GET /subscriptions/:id - 获取订阅详情
 * 
 * @future_endpoints
 * - PUT /subscriptions/:id - 更新订阅
 * - DELETE /subscriptions/:id - 取消订阅
 * - POST /subscriptions/:id/renew - 续费订阅
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * 创建新订阅
   * @route POST /subscriptions
   * @param createSubscriptionDto - 订阅创建数据
   * @returns 创建的订阅对象
   */
  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto): Subscription {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  /**
   * 获取所有订阅
   * @route GET /subscriptions
   * @returns 订阅列表
   */
  @Get()
  findAll(): Subscription[] {
    return this.subscriptionsService.findAll();
  }

  /**
   * 获取订阅详情
   * @route GET /subscriptions/:id
   * @param id - 订阅 ID
   * @returns 订阅对象或 undefined
   */
  @Get(':id')
  findOne(@Param('id') id: string): Subscription | undefined {
    return this.subscriptionsService.findOne(id);
  }
}