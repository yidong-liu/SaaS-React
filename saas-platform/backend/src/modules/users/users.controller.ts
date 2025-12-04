/**
 * =====================================================
 * 用户控制器 (Users Controller)
 * =====================================================
 * 
 * @description
 * 处理用户管理相关的 HTTP 请求
 * 
 * @route /api/v1/users
 * 
 * @endpoints
 * - POST /api/v1/users - 创建用户
 * - GET /api/v1/users - 获取用户列表（分页）
 * - GET /api/v1/users/:id - 获取用户详情
 * - PUT /api/v1/users/:id - 更新用户信息
 * - DELETE /api/v1/users/:id - 删除用户
 * - POST /api/v1/users/:id/roles - 分配角色
 * - GET /api/v1/users/:id/permissions - 获取用户权限
 * - PUT /api/v1/users/:id/password - 更新密码
 * 
 * @security
 * - 所有端点需要 JWT 认证（待实现）
 * - 基于租户的数据隔离
 * - 密码字段自动过滤，不返回给客户端
 * 
 * @multi_tenancy
 * - 租户 ID 从以下来源获取（优先级从高到低）：
 *   1. req.user.tenantId (JWT Token)
 *   2. req.headers['x-tenant-id'] (HTTP Header)
 * 
 * @response_format
 * ```json
 * {
 *   "success": true,
 *   "data": { ... },
 *   "meta": { "page": 1, "limit": 20, "total": 100 }
 * }
 * ```
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService, CreateUserDto, UpdateUserDto, AssignRoleDto } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 创建新用户
   * @route POST /api/v1/users
   * @param createUserDto - 用户创建数据
   * @param req - HTTP 请求对象
   * @returns 创建的用户信息（不含密码）
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
    const user = await this.usersService.create(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      data: userWithoutPassword,
    };
  }

  /**
   * 获取用户列表（分页）
   * @route GET /api/v1/users?page=1&limit=20
   * @param page - 页码，默认 1
   * @param limit - 每页条数，默认 20
   * @param req - HTTP 请求对象
   * @returns 用户列表和分页信息
   */
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const { users, total } = await this.usersService.findAll(
      tenantId,
      parseInt(page),
      parseInt(limit),
    );

    // 过滤密码字段
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    return {
      success: true,
      data: usersWithoutPassword,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    };
  }

  /**
   * 获取用户详情
   * @route GET /api/v1/users/:id
   * @param id - 用户 ID
   * @param req - HTTP 请求对象
   * @returns 用户详细信息（不含密码）
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const user = await this.usersService.findOne(id, tenantId);
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      data: userWithoutPassword,
    };
  }

  /**
   * 更新用户信息
   * @route PUT /api/v1/users/:id
   * @param id - 用户 ID
   * @param updateUserDto - 更新数据
   * @param req - HTTP 请求对象
   * @returns 更新后的用户信息
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const user = await this.usersService.update(id, tenantId, updateUserDto);
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      data: userWithoutPassword,
    };
  }

  /**
   * 删除用户
   * @route DELETE /api/v1/users/:id
   * @param id - 用户 ID
   * @param req - HTTP 请求对象
   * @returns 204 No Content
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    await this.usersService.remove(id, tenantId);
    return {
      success: true,
    };
  }

  /**
   * 为用户分配角色
   * @route POST /api/v1/users/:id/roles
   * @param userId - 用户 ID
   * @param body - 角色 ID 列表
   * @param req - HTTP 请求对象
   * @returns 更新后的用户信息
   */
  @Post(':id/roles')
  async assignRoles(
    @Param('id') userId: string,
    @Body() body: { roleIds: string[] },
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const user = await this.usersService.assignRoles(
      { userId, roleIds: body.roleIds },
      tenantId,
    );
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      data: userWithoutPassword,
    };
  }

  /**
   * 获取用户权限列表
   * @route GET /api/v1/users/:id/permissions
   * @param id - 用户 ID
   * @param req - HTTP 请求对象
   * @returns 权限列表
   */
  @Get(':id/permissions')
  async getUserPermissions(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const permissions = await this.usersService.getUserPermissions(id, tenantId);
    return {
      success: true,
      data: permissions,
    };
  }

  /**
   * 更新用户密码
   * @route PUT /api/v1/users/:id/password
   * @param id - 用户 ID
   * @param body - 新密码
   * @param req - HTTP 请求对象
   * @returns 成功消息
   */
  @Put(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    await this.usersService.updatePassword(id, body.newPassword, tenantId);
    return {
      success: true,
      message: 'Password updated successfully',
    };
  }
}