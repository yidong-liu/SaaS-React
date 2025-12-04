/**
 * =====================================================
 * 角色装饰器 (Roles Decorator)
 * =====================================================
 * 
 * @description
 * 用于标记路由处理器所需的角色权限
 * 
 * @responsibilities
 * - 将角色信息附加到路由元数据
 * - 配合角色守卫实现基于角色的访问控制 (RBAC)
 * 
 * @usage
 * ```typescript
 * @Roles('admin', 'manager')
 * @Get('sensitive-data')
 * getSensitiveData() {
 *   return 'Only admin and manager can access';
 * }
 * ```
 * 
 * @param roles - 允许访问的角色列表
 * @returns 元数据装饰器
 * 
 * @see RolesGuard - 配合使用的角色守卫
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
