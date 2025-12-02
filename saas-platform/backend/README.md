# SaaS Platform Backend (Next.js + Prisma)

## 项目概述
该项目是一个企业级 SaaS 平台的后端部分，基于 Node.js 和 TypeScript 构建。它提供了用户管理、认证、订阅等核心功能，并使用了现代的开发工具和最佳实践。

## 技术栈
- **运行时**: Node.js 20 LTS
- **框架**: NestJS
- **数据库**: PostgreSQL 15+
- **缓存**: Redis 7+
- **认证**: JWT
- **测试**: Jest

## 目录结构
```
backend/
├── src/
│   ├── main.ts                # 应用入口文件
│   ├── app.module.ts          # 主模块文件
│   ├── modules/               # 业务模块
│   │   ├── users/             # 用户模块
│   │   ├── auth/              # 认证模块
│   │   └── subscriptions/      # 订阅模块
│   ├── common/                # 共享代码
│   ├── config/                # 配置文件
│   └── database/              # 数据库迁移
├── package.json                # 项目依赖和脚本
├── tsconfig.json              # TypeScript 配置
├── Dockerfile                  # Docker 配置
├── .env.example                # 环境变量示例
└── README.md                  # 项目文档
```

# Backend (pnpm)

本目录已切换为 pnpm 管理依赖。

推荐在容器中或本地运行以下命令安装 pnpm（使用 corepack）并安装依赖：

```bash
# 启用 corepack 并激活 pnpm
corepack enable
corepack prepare pnpm@8 --activate

# 或使用官方安装脚本（任选其一）
# curl -fsSL https://get.pnpm.io/install.sh | sh -

# 安装依赖（在 backend 目录）
cd backend
pnpm install
```

首次安装会生成 pnpm-lock.yaml。若以前存在 package-lock.json 和/或 yarn.lock，请在切换 to pnpm 前删除这些锁文件以避免混淆。

常用命令：
- pnpm install
- pnpm add <pkg> # 添加依赖
- pnpm add -D <pkg> # 添加 dev 依赖
- pnpm run build / pnpm run dev / pnpm run start / pnpm run test
## 快速启动
1) 启动数据库（在仓库根）
```
docker compose up -d
```

2) 生成 Prisma Client 与迁移（在 backend）
```
cd backend
pnpm install
pnpm run prisma:generate
pnpm run prisma:migrate
pnpm run db:seed
```

3) 启动开发服务器
```
pnpm run dev
```
访问：http://localhost:3001/users 与 http://localhost:3001/api/users

## 目录与关键文件
- `app/api/users/route.ts`：示例 API（GET/POST）
- `app/users/page.tsx`：示例页面，展示 users
- `prisma/schema.prisma`：数据模型
- `prisma/seed.ts`：种子数据脚本

## 环境变量示例（backend/.env）
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=saas_platform
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saas_platform
```

## 贡献
欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证
本项目遵循 MIT 许可证。
