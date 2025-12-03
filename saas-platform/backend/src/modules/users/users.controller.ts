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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    await this.usersService.remove(id, tenantId);
    return {
      success: true,
    };
  }

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

  @Get(':id/permissions')
  async getUserPermissions(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
    const permissions = await this.usersService.getUserPermissions(id, tenantId);
    return {
      success: true,
      data: permissions,
    };
  }

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