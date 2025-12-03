# 🚀 快速开始指南

## 用户服务 - 后端实现

### 已完成的功能模块

✅ **用户管理** - 注册、登录、CRUD、密码管理  
✅ **多租户管理** - 租户创建、隔离、状态控制  
✅ **SSO 单点登录** - Google, GitHub, Microsoft, Okta, SAML  
✅ **权限管理** - RBAC 角色权限系统  
✅ **审计日志** - 完整的操作记录  

---

## 📦 安装步骤

### 1️⃣ 安装依赖
```bash
cd saas-platform/backend
pnpm install
```

### 2️⃣ 配置环境变量
创建 `.env` 文件：
```env
# 数据库连接
DATABASE_URL="postgresql://postgres:password@localhost:5432/saas_platform"

# JWT 密钥
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 服务端口
PORT=3001
```

### 3️⃣ 数据库设置
```bash
# 生成 Prisma Client
pnpm prisma:generate

# 运行数据库迁移
pnpm prisma migrate dev --name user_service_init

# (可选) 打开 Prisma Studio 查看数据库
pnpm prisma studio
```

### 4️⃣ 启动服务
```bash
pnpm dev
```

服务将在 `http://localhost:3001` 启动

---

## 🎯 初始化数据

### 步骤 1: 初始化默认权限
```bash
curl -X POST http://localhost:3001/api/v1/permissions/seed
```

### 步骤 2: 创建第一个租户
```bash
curl -X POST http://localhost:3001/api/v1/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "我的公司",
    "slug": "my-company",
    "domain": "mycompany.example.com"
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "tenant-uuid-here",
    "name": "我的公司",
    "slug": "my-company",
    "status": "ACTIVE"
  }
}
```

### 步骤 3: 获取 Admin 角色 ID
```bash
# 使用租户 ID 获取角色列表
curl -X GET http://localhost:3001/api/v1/roles \
  -H "x-tenant-id: tenant-uuid-from-step-2"
```

找到 `"name": "Admin"` 的角色，复制其 `id`

### 步骤 4: 创建管理员用户
```bash
curl -X POST http://localhost:3001/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "tenant-uuid-from-step-2",
    "email": "admin@mycompany.com",
    "password": "Admin123!@#",
    "firstName": "Admin",
    "lastName": "User",
    "roleIds": ["admin-role-id-from-step-3"]
  }'
```

---

## 🧪 测试 API

### 测试 1: 获取用户列表
```bash
curl -X GET "http://localhost:3001/api/v1/users?page=1&limit=10" \
  -H "x-tenant-id: your-tenant-id"
```

### 测试 2: 获取用户权限
```bash
curl -X GET http://localhost:3001/api/v1/users/USER_ID/permissions \
  -H "x-tenant-id: your-tenant-id"
```

### 测试 3: 创建新角色
```bash
curl -X POST http://localhost:3001/api/v1/roles \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "your-tenant-id",
    "name": "Editor",
    "description": "可以编辑内容的用户"
  }'
```

### 测试 4: 检查权限
```bash
curl -X GET "http://localhost:3001/api/v1/check-permission?userId=USER_ID&resource=user&action=create"
```

---

## 📚 API 文档

完整的 API 文档请查看：
- [用户服务使用文档](./src/modules/users/README.md)
- [API 端点总览](./USER_SERVICE_SUMMARY.md)

### 核心 API 端点

| 模块 | 方法 | 端点 | 说明 |
|------|------|------|------|
| 用户 | POST | `/api/v1/users` | 创建用户 |
| 用户 | GET | `/api/v1/users` | 用户列表 |
| 用户 | POST | `/api/v1/users/:id/roles` | 分配角色 |
| 租户 | POST | `/api/v1/tenants` | 创建租户 |
| 租户 | PUT | `/api/v1/tenants/:id/suspend` | 暂停租户 |
| SSO | POST | `/api/v1/sso/config` | SSO 配置 |
| SSO | POST | `/api/v1/sso/login` | SSO 登录 |
| 角色 | POST | `/api/v1/roles` | 创建角色 |
| 权限 | GET | `/api/v1/permissions` | 权限列表 |

---

## 🔐 SSO 配置示例

### Google OAuth 配置
```bash
curl -X POST http://localhost:3001/api/v1/sso/config \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "your-tenant-id",
    "provider": "GOOGLE",
    "clientId": "your-google-client-id",
    "clientSecret": "your-google-client-secret",
    "redirectUri": "http://localhost:3000/auth/callback"
  }'
```

### 获取 Google 授权 URL
```bash
curl -X GET http://localhost:3001/api/v1/sso/authorize/TENANT_ID/GOOGLE
```

---

## 📊 数据库结构

核心表：
- `tenants` - 租户
- `users` - 用户
- `roles` - 角色
- `permissions` - 权限
- `user_roles` - 用户角色关联
- `role_permissions` - 角色权限关联
- `sso_configs` - SSO 配置
- `audit_logs` - 审计日志

查看完整架构：`prisma/schema.prisma`

---

## 🛠️ 开发工具

### Prisma Studio (数据库 GUI)
```bash
pnpm prisma studio
```
访问 `http://localhost:5555`

### 查看生成的类型
```bash
# Prisma Client 生成在
node_modules/.prisma/client/
```

---

## 🔍 故障排查

### 问题 1: 数据库连接失败
- 检查 PostgreSQL 是否运行
- 验证 `DATABASE_URL` 配置
- 确认数据库已创建

### 问题 2: 迁移失败
```bash
# 重置数据库
pnpm prisma migrate reset

# 重新迁移
pnpm prisma migrate dev
```

### 问题 3: Prisma Client 未生成
```bash
pnpm prisma:generate
```

---

## 📝 下一步

1. ✅ 用户服务已完成
2. ⏭️ 实现认证服务 (Auth Service)
3. ⏭️ 添加 JWT Guards 和中间件
4. ⏭️ 实现邮件验证
5. ⏭️ 添加 Redis 缓存
6. ⏭️ 实现订阅计费服务

---

## 🤝 需要帮助？

查看详细文档：
- `USER_SERVICE_SUMMARY.md` - 功能总览
- `src/modules/users/README.md` - 使用指南
- `MIGRATION.md` - 数据库迁移
- `prisma/schema.prisma` - 数据模型

---

**祝开发顺利！** 🎉
