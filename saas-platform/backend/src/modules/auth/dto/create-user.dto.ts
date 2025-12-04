/**
 * =====================================================
 * 创建用户数据传输对象 (Create User DTO)
 * =====================================================
 * 
 * @description
 * 定义用户注册请求的数据结构和验证规则
 * 
 * @validation
 * - email: 必须是有效的邮箱格式，不能为空
 * - password: 字符串，最小长度 6 位
 * - firstName: 可选，字符串类型
 * - lastName: 可选，字符串类型
 * - username: 可选，字符串类型
 * 
 * @example
 * ```json
 * {
 *   "email": "newuser@example.com",
 *   "password": "strongPassword123",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "username": "johndoe"
 * }
 * ```
 * 
 * @security
 * - 密码会在服务层自动加密
 * - 邮箱唯一性在数据库层验证
 * 
 * @author SaaS Platform Team
 * @since 1.0.0
 */

import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  /** 用户邮箱地址（必填，唯一） */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /** 用户密码（必填，最小 6 位） */
  @IsString()
  @MinLength(6)
  password: string;

  /** 名字（可选） */
  @IsOptional()
  @IsString()
  firstName?: string;

  /** 姓氏（可选） */
  @IsOptional()
  @IsString()
  lastName?: string;

  /** 用户名（可选） */
  @IsOptional()
  @IsString()
  username?: string;
}
