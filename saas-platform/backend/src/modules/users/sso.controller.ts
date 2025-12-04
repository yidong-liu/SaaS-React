/**
 * =====================================================
 * SSO 控制器 (Single Sign-On Controller)
 * =====================================================
 * 
 * @description
 * 处理单点登录 (SSO) 相关的 HTTP 请求
 * 
 * @route /api/v1/sso
 * 
 * @endpoints
 * - POST /api/v1/sso/config - 创建 SSO 配置
 * - GET /api/v1/sso/config/:tenantId - 获取租户的 SSO 配置列表
 * - GET /api/v1/sso/config/:tenantId/:provider - 获取特定 SSO 配置
 * - PUT /api/v1/sso/config/:tenantId/:provider - 更新 SSO 配置
 * - DELETE /api/v1/sso/config/:tenantId/:provider - 删除 SSO 配置
 * - GET /api/v1/sso/authorize/:tenantId/:provider - 获取授权 URL
 * - POST /api/v1/sso/login - SSO 登录
 * 
 * @supported_providers
 * - Google OAuth 2.0
 * - GitHub OAuth
 * - Microsoft Azure AD
 * - Okta
 * - SAML 2.0
 * 
 * @security
 * - 客户端密钥加密存储
 * - 授权码验证
 * - CSRF Token 保护
 * 
 * @oauth_flow
 * 1. 获取授权 URL
 * 2. 用户重定向到提供商
 * 3. 用户授权后回调
 * 4. 使用授权码登录
 * 5. 返回 JWT Token
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
import { SSOService, CreateSSOConfigDto, UpdateSSOConfigDto, SSOLoginDto, SSOProvider } from './sso.service';

@Controller('api/v1/sso')
export class SSOController {
  constructor(private readonly ssoService: SSOService) {}

  /**
   * 创建 SSO 配置
   * @route POST /api/v1/sso/config
   */
  @Post('config')
  @HttpCode(HttpStatus.CREATED)
  async createConfig(@Body() createDto: CreateSSOConfigDto) {
    const config = await this.ssoService.createSSOConfig(createDto);
    return {
      success: true,
      data: config,
    };
  }

  /**
   * 获取租户的所有 SSO 配置
   * @route GET /api/v1/sso/config/:tenantId
   */
  @Get('config/:tenantId')
  async listConfigs(@Param('tenantId') tenantId: string) {
    const configs = await this.ssoService.listSSOConfigs(tenantId);
    return {
      success: true,
      data: configs,
    };
  }

  /**
   * 获取特定 SSO 配置
   * @route GET /api/v1/sso/config/:tenantId/:provider
   */
  @Get('config/:tenantId/:provider')
  async getConfig(@Param('tenantId') tenantId: string, @Param('provider') provider: SSOProvider) {
    const config = await this.ssoService.findSSOConfig(tenantId, provider);
    return {
      success: true,
      data: config,
    };
  }

  @Put('config/:tenantId/:provider')
  async updateConfig(
    @Param('tenantId') tenantId: string,
    @Param('provider') provider: SSOProvider,
    @Body() updateDto: UpdateSSOConfigDto,
  ) {
    const config = await this.ssoService.updateSSOConfig(tenantId, provider, updateDto);
    return {
      success: true,
      data: config,
    };
  }

  @Delete('config/:tenantId/:provider')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteConfig(@Param('tenantId') tenantId: string, @Param('provider') provider: SSOProvider) {
    await this.ssoService.deleteSSOConfig(tenantId, provider);
    return {
      success: true,
    };
  }

  @Get('authorize/:tenantId/:provider')
  async getAuthorizationUrl(
    @Param('tenantId') tenantId: string,
    @Param('provider') provider: SSOProvider,
  ) {
    const url = await this.ssoService.getAuthorizationUrl(tenantId, provider);
    return {
      success: true,
      data: { authorizationUrl: url },
    };
  }

  @Post('login')
  async login(@Body() loginDto: SSOLoginDto) {
    const result = await this.ssoService.handleSSOLogin(loginDto);
    return {
      success: true,
      data: result,
    };
  }
}
