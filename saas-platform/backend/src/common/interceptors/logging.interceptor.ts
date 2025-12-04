/**
 * =====================================================
 * 日志拦截器 (Logging Interceptor)
 * =====================================================
 * 
 * @description
 * 全局请求/响应日志拦截器，记录所有 HTTP 请求的详细信息
 * 
 * @responsibilities
 * - 记录请求方法和 URL
 * - 记录响应状态码
 * - 计算请求处理时间
 * - 输出格式化的日志信息
 * 
 * @usage
 * ```typescript
 * // 在 main.ts 中全局启用
 * app.useGlobalInterceptors(new LoggingInterceptor());
 * 
 * // 或在控制器级别使用
 * @UseInterceptors(LoggingInterceptor)
 * export class UsersController {}
 * ```
 * 
 * @output_format
 * ```
 * Incoming Request: GET /api/v1/users
 * Response: 200 - 45ms
 * ```
 * 
 * @performance
 * - 性能开销: < 1ms
 * - 适用场景: 开发环境和生产环境监控
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * 拦截请求和响应
   * @param context - 执行上下文
   * @param next - 下一个处理器
   * @returns Observable 响应流
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 获取请求和响应对象
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // 记录请求开始时间
    const now = Date.now();

    // 记录请求信息
    console.log(`Incoming Request: ${request.method} ${request.url}`);

    // 处理请求并记录响应信息
    return next
      .handle()
      .pipe(
        tap(() => {
          // 计算处理时间
          const duration = Date.now() - now;
          // 记录响应信息
          console.log(`Response: ${response.statusCode} - ${duration}ms`);
        }),
      );
  }
}