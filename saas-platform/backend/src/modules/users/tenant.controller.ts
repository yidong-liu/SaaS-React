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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTenantDto: CreateTenantDto) {
    const tenant = await this.tenantService.create(createTenantDto);
    return {
      success: true,
      data: tenant,
    };
  }

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
