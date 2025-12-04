/**
 * =====================================================
 * 认证凭证数据传输对象 (Auth Credentials DTO)
 * =====================================================
 * 
 * @description
 * 通用认证凭证数据结构，用于登录和其他需要验证用户身份的场景
 * 
 * @validation
 * - email: 必须是有效的邮箱格式，不能为空
 * - password: 必须是字符串，不能为空
 * 
 * @example
 * ```json
 * {
 *   "email": "user@example.com",
 *   "password": "userPassword"
 * }
 * ```
 * 
 * @usage_scenarios
 * - 用户登录验证
 * - 密码重置验证
 * - 双因素认证
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentialsDto {
  /** 用户邮箱地址 */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /** 用户密码 */
  @IsString()
  @IsNotEmpty()
  password: string;
}
