/**
 * =====================================================
 * JWT 认证守卫 (JWT Authentication Guard)
 * =====================================================
 * 
 * @description
 * 基于 JWT Token 的路由守卫，保护需要认证的 API 端点
 * 
 * @responsibilities
 * - 验证 JWT Token 的有效性
 * - 解析 Token 中的用户信息
 * - 将用户信息注入到请求对象中
 * - 拒绝无效或过期的 Token
 * 
 * @usage
 * ```typescript
 * @UseGuards(JwtGuard)
 * @Get('profile')
 * getProfile(@Request() req) {
 *   return req.user; // 已认证的用户信息
 * }
 * ```
 * 
 * @security
 * - Token 格式: Bearer <token>
 * - Token 来源: Authorization Header
 * - 验证失败返回 401 Unauthorized
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// ==================== 类型扩展 ====================
// 扩展 Express Request 类型，添加 user 属性
declare module 'express' {
  interface Request {
    user?: any;
  }
}

// ==================== JWT 守卫实现 ====================

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 验证请求是否有效
   * @param context - 执行上下文
   * @returns true 表示允许访问，false 表示拒绝访问
   */
  canActivate(context: ExecutionContext): boolean {
    // 获取 HTTP 请求对象
    const request = context.switchToHttp().getRequest<Request>();
    
    // 从 Authorization Header 中提取 Token
    const token = request.headers['authorization']?.split(' ')[1];

    // Token 不存在，拒绝访问
    if (!token) {
      return false;
    }

    try {
      // 验证并解析 Token
      const user = this.jwtService.verify(token);
      
      // 将用户信息注入到请求对象中
      request.user = user;
      
      // 允许访问
      return true;
    } catch (error) {
      // Token 无效或已过期，拒绝访问
      return false;
    }
  }
}