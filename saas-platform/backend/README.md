# SaaS Platform Backend

## 项目概述
企业级 SaaS 平台后端服务，提供完整的用户管理、多租户管理、SSO 单点登录和 RBAC 权限系统。

## ✨ 核心功能

### ✅ 用户服务 (User Service) - 已完成
- **用户管理**: 注册、登录、CRUD、密码管理
- **多租户管理**: 租户创建、隔离、状态控制、统计
- **SSO 单点登录**: 支持 Google、GitHub、Microsoft、Okta、SAML
- **权限管理**: 基于角色的访问控制 (RBAC)
- **审计日志**: 完整的操作记录

📚 **详细文档**: 
- [快速开始指南](./QUICKSTART.md)
- [用户服务功能总结](./USER_SERVICE_SUMMARY.md)
- [API 使用文档](./src/modules/users/README.md)
- [文件清单](./FILES_CHECKLIST.md)

## 技术栈
- **运行时**: Node.js 20 LTS
- **框架**: NestJS
- **数据库**: PostgreSQL 15+
- **ORM**: Prisma
- **缓存**: Redis 7+
- **认证**: JWT + Passport
- **加密**: bcrypt
- **语言**: TypeScript
- **包管理**: pnpm

## 🚀 快速启动

### 1. 安装依赖
```bash
# 启用 pnpm
corepack enable
corepack prepare pnpm@8 --activate

# 安装依赖
cd backend
pnpm install
```

### 2. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
# DATABASE_URL="postgresql://postgres:password@localhost:5432/saas_platform"
# JWT_SECRET="your-secret-key"
```

### 3. 启动数据库
```bash
# 在仓库根目录
docker compose up -d
```

### 4. 数据库迁移
```bash
cd backend

# 生成 Prisma Client
pnpm prisma:generate

# 运行迁移
pnpm prisma migrate dev --name init

# (可选) 查看数据库
pnpm prisma studio
```

### 5. 初始化数据
```bash
# 启动开发服务器
pnpm dev

# 在另一个终端，初始化默认权限
curl -X POST http://localhost:3001/api/v1/permissions/seed
```

### 6. 测试 API
```bash
# Windows
.\test-api.ps1

# Linux/Mac
bash test-api.sh
```

访问: http://localhost:3001

## 📁 项目结构

```
backend/
├── src/
│   ├── modules/
│   │   ├── users/              ✅ 用户服务模块
│   │   │   ├── users.service.ts           # 用户管理服务
│   │   │   ├── users.controller.ts        # 用户 API
│   │   │   ├── tenant.service.ts          # 租户管理服务
│   │   │   ├── tenant.controller.ts       # 租户 API
│   │   │   ├── sso.service.ts             # SSO 登录服务
│   │   │   ├── sso.controller.ts          # SSO API
│   │   │   ├── role-permission.service.ts # 权限管理服务
│   │   │   ├── role-permission.controller.ts # 权限 API
│   │   │   ├── users.module.ts            # 模块配置
│   │   │   └── README.md                  # 模块文档
│   │   ├── auth/               # 认证模块
│   │   └── subscriptions/      # 订阅模块
│   ├── common/                 # 共享代码
│   ├── config/                 # 配置文件
│   └── main.ts                 # 应用入口
│
├── prisma/
│   ├── schema.prisma           ✅ 数据库架构 (13 个模型)
│   └── seed.ts                 # 种子数据
│
├── .env.example                ✅ 环境变量模板
├── QUICKSTART.md               ✅ 快速开始指南
├── USER_SERVICE_SUMMARY.md     ✅ 功能总结
├── MIGRATION.md                ✅ 迁移说明
├── PROJECT_STATUS.md           ✅ 项目状态
├── FILES_CHECKLIST.md          ✅ 文件清单
├── test-api.sh                 ✅ API 测试脚本 (Bash)
├── test-api.ps1                ✅ API 测试脚本 (PowerShell)
└── package.json                # 依赖配置
```

## 🎯 API 端点总览

### 用户管理 (8 个端点)
- `POST /api/v1/users` - 创建用户
- `GET /api/v1/users` - 用户列表
- `GET /api/v1/users/:id` - 用户详情
- `PUT /api/v1/users/:id` - 更新用户
- `DELETE /api/v1/users/:id` - 删除用户
- `POST /api/v1/users/:id/roles` - 分配角色
- `GET /api/v1/users/:id/permissions` - 获取权限
- `PUT /api/v1/users/:id/password` - 修改密码

### 租户管理 (10 个端点)
- `POST /api/v1/tenants` - 创建租户
- `GET /api/v1/tenants` - 租户列表
- `GET /api/v1/tenants/:id` - 租户详情
- `PUT /api/v1/tenants/:id` - 更新租户
- `DELETE /api/v1/tenants/:id` - 删除租户
- 更多端点请查看 [API 文档](./src/modules/users/README.md)

### SSO 登录 (7 个端点)
- `POST /api/v1/sso/config` - SSO 配置
- `POST /api/v1/sso/login` - SSO 登录
- 更多端点请查看 [API 文档](./src/modules/users/README.md)

### 权限管理 (13 个端点)
- `POST /api/v1/roles` - 创建角色
- `GET /api/v1/roles` - 角色列表
- `POST /api/v1/permissions` - 创建权限
- `GET /api/v1/permissions` - 权限列表
- `GET /api/v1/check-permission` - 检查权限
- 更多端点请查看 [API 文档](./src/modules/users/README.md)

**总计**: 38+ API 端点

## 📊 数据库架构

### 核心数据模型 (13 个)
```
✅ Tenant           - 租户表
✅ User             - 用户表
✅ Role             - 角色表
✅ Permission       - 权限表
✅ UserRole         - 用户角色关联
✅ RolePermission   - 角色权限关联
✅ Session          - 会话表
✅ RefreshToken     - 刷新令牌表
✅ SSOConfig        - SSO 配置表
✅ Subscription     - 订阅表
✅ SubscriptionPlan - 订阅计划表
✅ Invoice          - 发票表
✅ AuditLog         - 审计日志表
```

详细架构请查看 [schema.prisma](./prisma/schema.prisma)

## 🔐 安全特性

- ✅ **密码安全**: bcrypt 加密，12 轮 salt
- ✅ **租户隔离**: 完整的数据隔离机制
- ✅ **权限控制**: 基于角色的访问控制 (RBAC)
- ✅ **JWT 认证**: Access Token + Refresh Token
- ✅ **审计日志**: 记录所有敏感操作

## 🛠️ 开发工具

### 常用命令
```bash
# 开发
pnpm dev                        # 启动开发服务器

# 数据库
pnpm prisma:generate            # 生成 Prisma Client
pnpm prisma:migrate             # 运行迁移
pnpm prisma studio              # 打开数据库 GUI

# 测试
pnpm test                       # 运行测试
bash test-api.sh               # API 测试 (Linux/Mac)
.\test-api.ps1                 # API 测试 (Windows)

# 构建
pnpm build                      # 构建生产版本
pnpm start                      # 启动生产服务器
```

## 📚 文档

| 文档 | 说明 |
|------|------|
| [QUICKSTART.md](./QUICKSTART.md) | ⭐ 快速开始指南 |
| [USER_SERVICE_SUMMARY.md](./USER_SERVICE_SUMMARY.md) | 功能总览 |
| [src/modules/users/README.md](./src/modules/users/README.md) | 详细 API 文档 |
| [MIGRATION.md](./MIGRATION.md) | 数据库迁移 |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | 项目状态 |
| [FILES_CHECKLIST.md](./FILES_CHECKLIST.md) | 文件清单 |

## 📈 项目统计

- **代码行数**: ~4,400 行
- **API 端点**: 38+
- **数据模型**: 13 个
- **服务类**: 4 个
- **控制器**: 4 个
- **SSO 提供商**: 5 个

## 🗺️ 路线图

### ✅ 已完成
- [x] 用户管理服务
- [x] 多租户管理
- [x] SSO 单点登录框架
- [x] RBAC 权限系统
- [x] 审计日志
- [x] 完整文档

### 🔄 进行中
- [ ] 认证中间件和 Guards
- [ ] 邮件服务
- [ ] SSO 提供商完整实现

### 📋 计划中
- [ ] 双因素认证 (2FA)
- [ ] Redis 缓存集成
- [ ] API 限流
- [ ] WebSocket 实时通知
- [ ] 订阅计费服务

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](../CONTRIBUTING.md)

## 📄 许可证

MIT License - 查看 [LICENSE](../LICENSE) 文件
