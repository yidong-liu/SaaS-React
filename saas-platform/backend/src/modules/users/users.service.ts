import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaClient, User, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface CreateUserDto {
  tenantId: string;
  email: string;
  username?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roleIds?: string[];
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  status?: UserStatus;
}

export interface AssignRoleDto {
  userId: string;
  roleIds: string[];
}

@Injectable()
export class UsersService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { tenantId, email, password, roleIds, ...userData } = createUserDto;

    // 检查租户是否存在
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    // 检查邮箱是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
    });

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists in this tenant`);
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email,
        password: hashedPassword,
        ...userData,
        userRoles: roleIds
          ? {
              create: roleIds.map((roleId) => ({
                role: { connect: { id: roleId } },
              })),
            }
          : undefined,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // 记录审计日志
    await this.createAuditLog({
      tenantId,
      userId: user.id,
      action: 'USER_CREATED',
      resource: 'User',
      details: { email: user.email },
    });

    return user;
  }

  async findAll(tenantId: string, page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { tenantId },
        skip,
        take: limit,
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { tenantId } }),
    ]);

    return { users, total };
  }

  async findOne(id: string, tenantId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string, tenantId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email,
        },
      },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, tenantId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id, tenantId);

    // 如果更新邮箱，检查是否冲突
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          tenantId_email: {
            tenantId,
            email: updateUserDto.email,
          },
        },
      });

      if (existingUser) {
        throw new ConflictException(`Email ${updateUserDto.email} is already in use`);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // 记录审计日志
    await this.createAuditLog({
      tenantId,
      userId: id,
      action: 'USER_UPDATED',
      resource: 'User',
      details: updateUserDto,
    });

    return updatedUser;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.findOne(id, tenantId);

    await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.DELETED },
    });

    // 记录审计日志
    await this.createAuditLog({
      tenantId,
      userId: id,
      action: 'USER_DELETED',
      resource: 'User',
      details: { userId: id },
    });
  }

  async assignRoles(assignRoleDto: AssignRoleDto, tenantId: string): Promise<User> {
    const { userId, roleIds } = assignRoleDto;

    const user = await this.findOne(userId, tenantId);

    // 验证所有角色都属于同一租户
    const roles = await this.prisma.role.findMany({
      where: {
        id: { in: roleIds },
        tenantId,
      },
    });

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('One or more roles not found or do not belong to this tenant');
    }

    // 删除现有角色
    await this.prisma.userRole.deleteMany({
      where: { userId },
    });

    // 分配新角色
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        userRoles: {
          create: roleIds.map((roleId) => ({
            role: { connect: { id: roleId } },
          })),
        },
      },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 记录审计日志
    await this.createAuditLog({
      tenantId,
      userId,
      action: 'ROLES_ASSIGNED',
      resource: 'User',
      details: { roleIds },
    });

    return updatedUser;
  }

  async getUserPermissions(userId: string, tenantId: string): Promise<string[]> {
    const user = await this.findOne(userId, tenantId);

    const permissions = new Set<string>();

    for (const userRole of user.userRoles) {
      for (const rolePermission of userRole.role.permissions) {
        permissions.add(`${rolePermission.permission.resource}:${rolePermission.permission.action}`);
      }
    }

    return Array.from(permissions);
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return false;
    }

    return bcrypt.compare(password, user.password);
  }

  async updatePassword(userId: string, newPassword: string, tenantId: string): Promise<void> {
    await this.findOne(userId, tenantId);

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // 记录审计日志
    await this.createAuditLog({
      tenantId,
      userId,
      action: 'PASSWORD_UPDATED',
      resource: 'User',
      details: { userId },
    });
  }

  private async createAuditLog(data: {
    tenantId: string;
    userId?: string;
    action: string;
    resource: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await this.prisma.auditLog.create({
      data,
    });
  }
}