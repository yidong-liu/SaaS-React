import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient, SSOProvider, SSOConfig } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

export interface CreateSSOConfigDto {
  tenantId: string;
  provider: SSOProvider;
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  metadata?: any;
}

export interface UpdateSSOConfigDto {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  metadata?: any;
  enabled?: boolean;
}

export interface SSOLoginDto {
  provider: SSOProvider;
  code: string;
  tenantId: string;
}

export interface SSOUserInfo {
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  providerId: string;
}

@Injectable()
export class SSOService {
  private prisma: PrismaClient;

  constructor(private jwtService: JwtService) {
    this.prisma = new PrismaClient();
  }

  async createSSOConfig(createDto: CreateSSOConfigDto): Promise<SSOConfig> {
    const { tenantId, provider } = createDto;

    // 检查是否已存在该提供商的配置
    const existing = await this.prisma.sSOConfig.findUnique({
      where: {
        tenantId_provider: {
          tenantId,
          provider,
        },
      },
    });

    if (existing) {
      throw new UnauthorizedException(`SSO config for ${provider} already exists`);
    }

    return this.prisma.sSOConfig.create({
      data: createDto,
    });
  }

  async updateSSOConfig(
    tenantId: string,
    provider: SSOProvider,
    updateDto: UpdateSSOConfigDto,
  ): Promise<SSOConfig> {
    const config = await this.findSSOConfig(tenantId, provider);

    return this.prisma.sSOConfig.update({
      where: { id: config.id },
      data: updateDto,
    });
  }

  async findSSOConfig(tenantId: string, provider: SSOProvider): Promise<SSOConfig> {
    const config = await this.prisma.sSOConfig.findUnique({
      where: {
        tenantId_provider: {
          tenantId,
          provider,
        },
      },
    });

    if (!config) {
      throw new NotFoundException(`SSO config for ${provider} not found`);
    }

    return config;
  }

  async listSSOConfigs(tenantId: string): Promise<SSOConfig[]> {
    return this.prisma.sSOConfig.findMany({
      where: { tenantId },
    });
  }

  async deleteSSOConfig(tenantId: string, provider: SSOProvider): Promise<void> {
    const config = await this.findSSOConfig(tenantId, provider);

    await this.prisma.sSOConfig.delete({
      where: { id: config.id },
    });
  }

  async handleSSOLogin(loginDto: SSOLoginDto): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const { provider, code, tenantId } = loginDto;

    // 获取 SSO 配置
    const ssoConfig = await this.findSSOConfig(tenantId, provider);

    if (!ssoConfig.enabled) {
      throw new UnauthorizedException(`SSO provider ${provider} is disabled`);
    }

    // 根据不同的提供商处理登录
    let userInfo: SSOUserInfo;
    switch (provider) {
      case SSOProvider.GOOGLE:
        userInfo = await this.handleGoogleLogin(code, ssoConfig);
        break;
      case SSOProvider.GITHUB:
        userInfo = await this.handleGitHubLogin(code, ssoConfig);
        break;
      case SSOProvider.MICROSOFT:
        userInfo = await this.handleMicrosoftLogin(code, ssoConfig);
        break;
      case SSOProvider.OKTA:
        userInfo = await this.handleOktaLogin(code, ssoConfig);
        break;
      case SSOProvider.SAML:
        userInfo = await this.handleSAMLLogin(code, ssoConfig);
        break;
      default:
        throw new UnauthorizedException(`Unsupported SSO provider: ${provider}`);
    }

    // 查找或创建用户
    let user = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId,
          email: userInfo.email,
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

    if (!user) {
      // 自动创建用户
      user = await this.prisma.user.create({
        data: {
          tenantId,
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          avatar: userInfo.avatar,
          emailVerified: true,
          status: 'ACTIVE',
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

      // 分配默认角色
      const defaultRole = await this.prisma.role.findFirst({
        where: {
          tenantId,
          name: 'User',
        },
      });

      if (defaultRole) {
        await this.prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: defaultRole.id,
          },
        });
      }
    }

    // 更新最后登录时间
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 生成 JWT tokens
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // 保存 refresh token
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 记录审计日志
    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: user.id,
        action: 'SSO_LOGIN',
        resource: 'Auth',
        details: { provider },
      },
    });

    const { password, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  private async handleGoogleLogin(code: string, config: SSOConfig): Promise<SSOUserInfo> {
    // 实现 Google OAuth 2.0 登录
    // 1. 使用 code 换取 access_token
    // 2. 使用 access_token 获取用户信息
    // 这里是示例实现，实际需要调用 Google API
    
    // TODO: 实现实际的 Google OAuth 流程
    throw new Error('Google SSO not fully implemented yet');
  }

  private async handleGitHubLogin(code: string, config: SSOConfig): Promise<SSOUserInfo> {
    // 实现 GitHub OAuth 登录
    // TODO: 实现实际的 GitHub OAuth 流程
    throw new Error('GitHub SSO not fully implemented yet');
  }

  private async handleMicrosoftLogin(code: string, config: SSOConfig): Promise<SSOUserInfo> {
    // 实现 Microsoft OAuth 登录
    // TODO: 实现实际的 Microsoft OAuth 流程
    throw new Error('Microsoft SSO not fully implemented yet');
  }

  private async handleOktaLogin(code: string, config: SSOConfig): Promise<SSOUserInfo> {
    // 实现 Okta OAuth 登录
    // TODO: 实现实际的 Okta OAuth 流程
    throw new Error('Okta SSO not fully implemented yet');
  }

  private async handleSAMLLogin(code: string, config: SSOConfig): Promise<SSOUserInfo> {
    // 实现 SAML 2.0 登录
    // TODO: 实现实际的 SAML 流程
    throw new Error('SAML SSO not fully implemented yet');
  }

  async getAuthorizationUrl(tenantId: string, provider: SSOProvider): Promise<string> {
    const config = await this.findSSOConfig(tenantId, provider);

    if (!config.enabled) {
      throw new UnauthorizedException(`SSO provider ${provider} is disabled`);
    }

    switch (provider) {
      case SSOProvider.GOOGLE:
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=openid%20email%20profile`;
      case SSOProvider.GITHUB:
        return `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&scope=user:email`;
      case SSOProvider.MICROSOFT:
        return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=openid%20email%20profile`;
      default:
        throw new UnauthorizedException(`Unsupported SSO provider: ${provider}`);
    }
  }
}
