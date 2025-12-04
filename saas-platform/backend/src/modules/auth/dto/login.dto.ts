/**
 * =====================================================
 * 登录数据传输对象 (Login DTO)
 * =====================================================
 * 
 * @description
 * 定义用户登录请求的数据结构和验证规则
 * 
 * @validation
 * - email: 必须是有效的邮箱格式，不能为空
 * - password: 必须是字符串，不能为空
 * 
 * @example
 * ```json
 * {
 *   "email": "user@example.com",
 *   "password": "securePassword123"
 * }
 * ```
 * 
 * @usage
 * ```typescript
 * @Post('login')
 * async login(@Body() loginDto: LoginDto) {
 *   return this.authService.login(loginDto);
 * }
 * ```
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /** 用户邮箱地址 */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /** 用户密码 */
  @IsString()
  @IsNotEmpty()
  password: string;
}
