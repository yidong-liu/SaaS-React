# 用户服务模块 (User Service Module)

完整的企业级用户管理、多租户、SSO单点登录和权限管理系统。

## 功能特性

### 1. 用户管理 (User Management)
- ✅ 用户注册与登录
- ✅ 用户信息 CRUD 操作
- ✅ 密码加密存储 (bcrypt)
- ✅ 用户状态管理
- ✅ 用户角色分配
- ✅ 用户权限查询

### 2. 多租户管理 (Multi-Tenant Management)
- ✅ 租户创建与管理
- ✅ 租户隔离（数据隔离）
- ✅ 租户状态控制（激活/暂停/删除）
- ✅ 租户统计信息
- ✅ 租户域名/子域名支持
- ✅ 默认角色自动创建

### 3. SSO 单点登录 (Single Sign-On)
- ✅ 支持多种 SSO 提供商：
  - Google OAuth 2.0
  - GitHub OAuth
  - Microsoft OAuth
  - Okta
  - SAML 2.0
- ✅ 自动用户创建
- ✅ JWT Token 认证
- ✅ Refresh Token 机制
- ✅ SSO 配置管理

### 4. 权限管理 (Role-Based Access Control - RBAC)
- ✅ 角色创建与管理
- ✅ 权限定义（资源:操作）
- ✅ 角色权限分配
- ✅ 用户角色分配
- ✅ 权限检查
- ✅ 系统角色保护

### 5. 审计日志 (Audit Logging)
- ✅ 所有重要操作记录
- ✅ 用户操作追踪
- ✅ IP 地址和 User Agent 记录

## 数据库架构

### 核心表结构
```
tenants          - 租户表
users            - 用户表
roles            - 角色表
permissions      - 权限表
user_roles       - 用户角色关联表
role_permissions - 角色权限关联表
sessions         - 会话表
refresh_tokens   - 刷新令牌表
sso_configs      - SSO 配置表
audit_logs       - 审计日志表
subscriptions    - 订阅表
```

## API 端点

### 用户管理 API

#### 创建用户
```http
POST /api/v1/users
Content-Type: application/json

{
  "tenantId": "uuid",
  "email": "user@example.com",
  "password": "SecureP@ssw0rd",
  "firstName": "John",
  "lastName": "Doe",
  "roleIds": ["role-uuid-1", "role-uuid-2"]
}
```

#### 获取用户列表
```http
GET /api/v1/users?page=1&limit=20
Headers:
  x-tenant-id: tenant-uuid
```

#### 获取单个用户
```http
GET /api/v1/users/:id
Headers:
  x-tenant-id: tenant-uuid
```

#### 更新用户
```http
PUT /api/v1/users/:id
Content-Type: application/json

{
  "firstName": "Jane",
  "status": "ACTIVE"
}
```

#### 分配角色
```http
POST /api/v1/users/:id/roles
Content-Type: application/json

{
  "roleIds": ["role-uuid-1", "role-uuid-2"]
}
```

#### 获取用户权限
```http
GET /api/v1/users/:id/permissions
```

#### 修改密码
```http
PUT /api/v1/users/:id/password
Content-Type: application/json

{
  "newPassword": "NewSecureP@ssw0rd"
}
```

### 租户管理 API

#### 创建租户
```http
POST /api/v1/tenants
Content-Type: application/json

{
  "name": "Acme Corp",
  "slug": "acme-corp",
  "domain": "acme.example.com",
  "settings": {
    "features": ["analytics", "reports"]
  }
}
```

#### 获取租户列表
```http
GET /api/v1/tenants?page=1&limit=20
```

#### 通过 Slug 获取租户
```http
GET /api/v1/tenants/slug/:slug
```

#### 暂停租户
```http
PUT /api/v1/tenants/:id/suspend
```

#### 激活租户
```http
PUT /api/v1/tenants/:id/activate
```

#### 获取租户统计
```http
GET /api/v1/tenants/:id/stats
```

### SSO 单点登录 API

#### 创建 SSO 配置
```http
POST /api/v1/sso/config
Content-Type: application/json

{
  "tenantId": "tenant-uuid",
  "provider": "GOOGLE",
  "clientId": "google-client-id",
  "clientSecret": "google-client-secret",
  "redirectUri": "https://app.example.com/auth/callback"
}
```

#### 获取授权 URL
```http
GET /api/v1/sso/authorize/:tenantId/:provider

Response:
{
  "success": true,
  "data": {
    "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

#### SSO 登录
```http
POST /api/v1/sso/login
Content-Type: application/json

{
  "provider": "GOOGLE",
  "code": "authorization-code-from-provider",
  "tenantId": "tenant-uuid"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "user": { ... }
  }
}
```

### 角色权限管理 API

#### 创建角色
```http
POST /api/v1/roles
Content-Type: application/json

{
  "tenantId": "tenant-uuid",
  "name": "Editor",
  "description": "Can edit content",
  "permissionIds": ["perm-uuid-1", "perm-uuid-2"]
}
```

#### 获取所有角色
```http
GET /api/v1/roles
Headers:
  x-tenant-id: tenant-uuid
```

#### 分配权限给角色
```http
POST /api/v1/roles/:id/permissions
Content-Type: application/json

{
  "permissionIds": ["perm-uuid-1", "perm-uuid-2", "perm-uuid-3"]
}
```

#### 创建权限
```http
POST /api/v1/permissions
Content-Type: application/json

{
  "resource": "article",
  "action": "publish",
  "description": "Publish articles"
}
```

#### 获取所有权限
```http
GET /api/v1/permissions
```

#### 检查用户权限
```http
GET /api/v1/check-permission?userId=user-uuid&resource=article&action=publish

Response:
{
  "success": true,
  "data": {
    "hasPermission": true
  }
}
```

#### 初始化默认权限
```http
POST /api/v1/permissions/seed
```

## 环境变量配置

在 `.env` 文件中添加以下配置：

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/saas_platform"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# SSO Providers (示例)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 使用步骤

### 1. 安装依赖
```bash
cd saas-platform/backend
pnpm install
```

### 2. 数据库迁移
```bash
pnpm prisma:generate
pnpm prisma:migrate
```

### 3. 初始化权限
```bash
# 启动服务后，调用 API 初始化默认权限
curl -X POST http://localhost:3001/api/v1/permissions/seed
```

### 4. 创建第一个租户
```bash
curl -X POST http://localhost:3001/api/v1/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "slug": "my-company"
  }'
```

### 5. 创建管理员用户
```bash
curl -X POST http://localhost:3001/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "tenant-uuid-from-step-4",
    "email": "admin@mycompany.com",
    "password": "SecurePassword123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

## 安全特性

### 1. 密码安全
- bcrypt 加密，12 轮 salt
- 最小长度 8 个字符
- 密码不会在 API 响应中返回

### 2. 租户隔离
- 所有查询都基于 tenantId 过滤
- 防止跨租户数据访问
- 租户级别的数据隔离

### 3. 权限控制
- 基于角色的访问控制（RBAC）
- 细粒度权限（资源:操作）
- 系统角色保护机制

### 4. JWT 认证
- Access Token (15分钟)
- Refresh Token (7天)
- Token 自动刷新机制

### 5. 审计日志
- 记录所有重要操作
- 包含用户、时间、操作、详情
- 支持审计追踪

## 权限系统说明

### 默认权限资源
- `user` - 用户管理
- `role` - 角色管理
- `tenant` - 租户管理
- `subscription` - 订阅管理
- `audit` - 审计日志

### 默认操作
- `create` - 创建
- `read` - 读取
- `update` - 更新
- `delete` - 删除

### 默认角色
每个新租户自动创建：
- **Admin** - 完全访问权限（系统角色）
- **Manager** - 管理用户和内容（系统角色）
- **User** - 基本用户访问（系统角色）

## SSO 集成说明

### Google OAuth 2.0
1. 在 Google Cloud Console 创建 OAuth 2.0 客户端
2. 配置回调 URL
3. 创建 SSO 配置
4. 用户通过授权 URL 登录

### GitHub OAuth
1. 在 GitHub 创建 OAuth App
2. 配置回调 URL
3. 创建 SSO 配置
4. 用户通过授权 URL 登录

### 自动用户创建
- 首次 SSO 登录自动创建用户
- 自动验证邮箱
- 分配默认 "User" 角色
- 记录审计日志

## 多租户最佳实践

### 1. 租户识别
- 通过 Header: `x-tenant-id`
- 通过子域名自动识别
- 通过自定义域名识别

### 2. 数据隔离
- 所有表包含 `tenantId`
- 所有查询强制过滤 `tenantId`
- 防止数据泄露

### 3. 租户配置
- 支持租户级别的自定义设置
- JSON 格式存储灵活配置
- 动态特性开关

## 下一步开发

### 待实现功能
- [ ] 完整的 OAuth 提供商实现
- [ ] 邮件验证功能
- [ ] 双因素认证 (2FA)
- [ ] 密码重置功能
- [ ] 用户邀请系统
- [ ] API 限流
- [ ] Redis 缓存集成
- [ ] WebSocket 实时通知

## 测试

```bash
# 运行测试
pnpm test

# 生成测试覆盖率
pnpm test:cov
```

## 许可证

MIT
