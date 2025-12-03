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
import { SSOService, CreateSSOConfigDto, UpdateSSOConfigDto, SSOLoginDto } from './sso.service';
import { SSOProvider } from '@prisma/client';

@Controller('api/v1/sso')
export class SSOController {
  constructor(private readonly ssoService: SSOService) {}

  @Post('config')
  @HttpCode(HttpStatus.CREATED)
  async createConfig(@Body() createDto: CreateSSOConfigDto) {
    const config = await this.ssoService.createSSOConfig(createDto);
    return {
      success: true,
      data: config,
    };
  }

  @Get('config/:tenantId')
  async listConfigs(@Param('tenantId') tenantId: string) {
    const configs = await this.ssoService.listSSOConfigs(tenantId);
    return {
      success: true,
      data: configs,
    };
  }

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
