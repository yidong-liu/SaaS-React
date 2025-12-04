/**
 * =====================================================
 * 租户控制器 (Tenant Controller)
 * =====================================================
 * 
 * @description
 * 处理多租户管理相关的 HTTP 请求
 * 
 * @route /api/v1/tenants
 * 
 * @endpoints
 * - POST /api/v1/tenants - 创建租户
 * - GET /api/v1/tenants - 获取租户列表（分页）
 * - GET /api/v1/tenants/:id - 获取租户详情
 * - PUT /api/v1/tenants/:id - 更新租户信息
 * - DELETE /api/v1/tenants/:id - 删除租户
 * - PUT /api/v1/tenants/:id/activate - 激活租户
 * - PUT /api/v1/tenants/:id/suspend - 暂停租户
 * - PUT /api/v1/tenants/:id/settings - 更新租户设置
 * 
 * @multi_tenancy
 * 租户是系统的核心隔离单元，所有数据按租户隔离
 * 
 * @features
 * - 租户 CRUD 操作
 * - 租户状态管理
 * - 租户设置配置
 * - 租户统计信息
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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TenantService, CreateTenantDto, UpdateTenantDto } from './tenant.service';

@Controller('api/v1/tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * 创建新租户
   * @route POST /api/v1/tenants
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTenantDto: CreateTenantDto) {
    const tenant = await this.tenantService.create(createTenantDto);
    return {
      success: true,
      data: tenant,
    };
  }

  /**
   * 获取租户列表（分页）
   * @route GET /api/v1/tenants?page=1&limit=20
   */
  @Get()
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    const { tenants, total } = await this.tenantService.findAll(
      parseInt(page),
      parseInt(limit),
    );

    return {
      success: true,
      data: tenants,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tenant = await this.tenantService.findOne(id);
    return {
      success: true,
      data: tenant,
    };
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const tenant = await this.tenantService.findBySlug(slug);
    return {
      success: true,
      data: tenant,
    };
  }

  @Get('domain/:domain')
  async findByDomain(@Param('domain') domain: string) {
    const tenant = await this.tenantService.findByDomain(domain);
    return {
      success: true,
      data: tenant,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    const tenant = await this.tenantService.update(id, updateTenantDto);
    return {
      success: true,
      data: tenant,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.tenantService.remove(id);
    return {
      success: true,
    };
  }

  @Put(':id/suspend')
  async suspend(@Param('id') id: string) {
    const tenant = await this.tenantService.suspend(id);
    return {
      success: true,
      data: tenant,
    };
  }

  @Put(':id/activate')
  async activate(@Param('id') id: string) {
    const tenant = await this.tenantService.activate(id);
    return {
      success: true,
      data: tenant,
    };
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    const stats = await this.tenantService.getTenantStats(id);
    return {
      success: true,
      data: stats,
    };
  }
}
