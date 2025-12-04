/**
 * =====================================================
 * 认证控制器 (Authentication Controller)
 * =====================================================
 * 
 * @description
 * 处理用户认证相关的 HTTP 请求
 * 
 * @route /auth
 * 
 * @endpoints
 * - POST /auth/register - 用户注册
 * - POST /auth/login - 用户登录
 * - GET /auth/profile/:id - 获取用户资料
 * 
 * @request_flow
 * 1. 接收 HTTP 请求
 * 2. 验证请求数据 (DTO)
 * 3. 调用 AuthService 处理业务逻辑
 * 4. 返回 HTTP 响应
 * 
 * @security
 * - 注册和登录端点: 公开访问
 * - 用户资料端点: 需要 JWT 认证（待实现）
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册
   * @route POST /auth/register
   * @param createUserDto - 用户注册数据
   * @returns 创建的用户信息
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /**
   * 用户登录
   * @route POST /auth/login
   * @param loginDto - 登录凭证
   * @returns JWT Access Token
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * 获取用户资料
   * @route GET /auth/profile/:id
   * @param id - 用户 ID
   * @returns 用户详细信息
   */
  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.authService.getProfile(id);
  }
}