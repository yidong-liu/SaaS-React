/**
 * =====================================================
 * 认证服务 (Authentication Service)
 * =====================================================
 * 
 * @description
 * 处理用户认证相关的核心业务逻辑
 * 
 * @responsibilities
 * - 用户注册处理
 * - 用户登录验证
 * - JWT Token 生成
 * - 用户资料查询
 * 
 * @security
 * - 密码加密存储 (bcrypt)
 * - JWT Token 签名
 * - 密码验证
 * 
 * @dependencies
 * - UsersService: 用户数据管理
 * - JwtService: JWT Token 处理
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   * @param authCredentialsDto - 注册凭证（邮箱、密码等）
   * @returns 创建的用户信息
   * 
   * @throws ConflictException - 邮箱已存在
   * @throws BadRequestException - 输入验证失败
   */
  async register(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    return this.usersService.createUser(authCredentialsDto);
  }

  /**
   * 用户登录
   * @param authCredentialsDto - 登录凭证（邮箱、密码）
   * @returns JWT Access Token
   * 
   * @throws UnauthorizedException - 凭证无效
   * 
   * @example
   * ```typescript
   * const { accessToken } = await authService.login({
   *   email: 'user@example.com',
   *   password: 'password123'
   * });
   * ```
   */
  async login(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    // 验证用户凭证
    const user = await this.usersService.validateUserPassword(authCredentialsDto);
    
    // 生成 JWT Token
    const accessToken = this.jwtService.sign({ 
      username: user.username, 
      sub: user.id 
    });
    
    return { accessToken };
  }

  /**
   * 获取用户资料
   * @param userId - 用户 ID
   * @returns 用户详细信息
   * 
   * @throws NotFoundException - 用户不存在
   */
  async getProfile(userId: string) {
    // 获取租户信息（临时实现，应从上下文获取）
    const tenant = await this.usersService['prisma'].tenant.findFirst();
    if (!tenant) {
      throw new Error('No tenant found');
    }
    
    return this.usersService.findOne(userId, tenant.id);
  }
}