import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient, Tenant, TenantStatus } from '@prisma/client';

export interface CreateTenantDto {
  name: string;
  slug: string;
  domain?: string;
  settings?: any;
}

export interface UpdateTenantDto {
  name?: string;
  domain?: string;
  settings?: any;
  status?: TenantStatus;
}

@Injectable()
export class TenantService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

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
