/**
 * =====================================================
 * 租户服务 (Tenant Service)
 * =====================================================
 * 
 * @description
 * 租户管理的核心业务逻辑服务
 * 
 * @responsibilities
 * - 租户创建、查询、更新、删除
 * - 租户状态管理
 * - 租户唯一性验证（slug、domain）
 * - 租户配置管理
 * - 租户统计信息
 * 
 * @multi_tenancy
 * 租户是 SaaS 系统的核心隔离单元
 * 每个租户拥有独立的数据空间
 * 
 * @uniqueness_constraints
 * - slug: 租户唯一标识符（URL 友好）
 * - domain: 自定义域名（可选）
 * 
 * @tenant_statuses
 * - ACTIVE: 活跃状态，可正常使用
 * - SUSPENDED: 暂停状态，限制访问
 * - DELETED: 已删除，软删除标记
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type Tenant = any;

/**
 * 租户状态枚举
 */
enum TenantStatus {
  ACTIVE = 'ACTIVE',         // 活跃
  SUSPENDED = 'SUSPENDED',   // 暂停
  DELETED = 'DELETED'        // 已删除
}

/**
 * 创建租户数据传输对象
 */
export interface CreateTenantDto {
  name: string;       // 租户名称
  slug: string;       // 租户标识符（唯一）
  domain?: string;    // 自定义域名（可选）
  settings?: any;     // 租户配置（JSON）
}

/**
 * 更新租户数据传输对象
 */
export interface UpdateTenantDto {
  name?: string;          // 租户名称
  domain?: string;        // 自定义域名
  settings?: any;         // 租户配置
  status?: TenantStatus;  // 租户状态
}

@Injectable()
export class TenantService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 创建新租户
   * @param createTenantDto - 租户创建数据
   * @returns 创建的租户对象
   * 
   * @throws ConflictException - slug 或 domain 已存在
   */
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const { slug, domain } = createTenantDto;

    // 检查 slug 是否已存在
    const existingBySlug = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (existingBySlug) {
      throw new ConflictException(`Tenant with slug ${slug} already exists`);
    }

    // 检查 domain 是否已存在
    if (domain) {
      const existingByDomain = await this.prisma.tenant.findUnique({
        where: { domain },
      });

      if (existingByDomain) {
        throw new ConflictException(`Tenant with domain ${domain} already exists`);
      }
    }

    const tenant = await this.prisma.tenant.create({
      data: createTenantDto,
    });

    // 创建默认角色
    await this.createDefaultRoles(tenant.id);

    return tenant;
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{ tenants: Tenant[]; total: number }> {
    const skip = (page - 1) * limit;

    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              users: true,
              subscriptions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count(),
    ]);

    return { tenants, total };
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            roles: true,
            subscriptions: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { slug },
    });
  }

  async findByDomain(domain: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { domain },
    });
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    await this.findOne(id);

    // 检查 domain 冲突
    if (updateTenantDto.domain) {
      const existingByDomain = await this.prisma.tenant.findUnique({
        where: { domain: updateTenantDto.domain },
      });

      if (existingByDomain && existingByDomain.id !== id) {
        throw new ConflictException(`Domain ${updateTenantDto.domain} is already in use`);
      }
    }

    return this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.tenant.update({
      where: { id },
      data: { status: TenantStatus.DELETED },
    });
  }

  async suspend(id: string): Promise<Tenant> {
    await this.findOne(id);

    return this.prisma.tenant.update({
      where: { id },
      data: { status: TenantStatus.SUSPENDED },
    });
  }

  async activate(id: string): Promise<Tenant> {
    await this.findOne(id);

    return this.prisma.tenant.update({
      where: { id },
      data: { status: TenantStatus.ACTIVE },
    });
  }

  private async createDefaultRoles(tenantId: string): Promise<void> {
    const defaultRoles = [
      {
        name: 'Admin',
        description: 'Full access to all resources',
        isSystem: true,
      },
      {
        name: 'Manager',
        description: 'Manage users and content',
        isSystem: true,
      },
      {
        name: 'User',
        description: 'Basic user access',
        isSystem: true,
      },
    ];

    await this.prisma.role.createMany({
      data: defaultRoles.map((role) => ({
        tenantId,
        ...role,
      })),
    });
  }

  async getTenantStats(id: string): Promise<any> {
    await this.findOne(id);

    const [userCount, activeUserCount, roleCount, subscriptionCount] = await Promise.all([
      this.prisma.user.count({ where: { tenantId: id } }),
      this.prisma.user.count({ where: { tenantId: id, status: 'ACTIVE' } }),
      this.prisma.role.count({ where: { tenantId: id } }),
      this.prisma.subscription.count({ where: { tenantId: id } }),
    ]);

    return {
      users: {
        total: userCount,
        active: activeUserCount,
      },
      roles: roleCount,
      subscriptions: subscriptionCount,
    };
  }
}
