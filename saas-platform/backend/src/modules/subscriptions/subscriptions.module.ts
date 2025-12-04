/**
 * =====================================================
 * 订阅管理模块 (Subscriptions Module)
 * =====================================================
 * 
 * @description
 * SaaS 订阅计划管理模块，处理用户订阅的创建、更新和查询
 * 
 * @module SubscriptionsModule
 * 
 * @features
 * - 创建订阅
 * - 查询订阅列表
 * - 查询单个订阅详情
 * - 更新订阅信息
 * - 取消订阅
 * 
 * @controllers
 * - SubscriptionsController: 订阅管理 API 端点
 * 
 * @providers
 * - SubscriptionsService: 订阅业务逻辑服务
 * 
 * @api_endpoints
 * - POST /subscriptions - 创建订阅
 * - GET /subscriptions - 获取订阅列表
 * - GET /subscriptions/:id - 获取订阅详情
 * 
 * @future_enhancements
 * - 集成支付网关 (Stripe/PayPal)
 * - 订阅自动续费
 * - 订阅升级/降级
 * - 订阅统计分析
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}