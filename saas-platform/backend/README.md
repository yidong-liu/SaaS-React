# SaaS Platform Backend

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

## 安装与运行
1. 克隆项目：
   ```
   git clone <repository-url>
   cd saas-platform/backend
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 配置环境变量：
   复制 `.env.example` 为 `.env` 并根据需要进行修改。

4. 启动应用：
   ```
   npm run start:dev
   ```

## API 文档
后端提供了 RESTful API 接口，详细的 API 文档请参考项目中的相关文档或使用 Swagger 进行查看。

## 贡献
欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证
本项目遵循 MIT 许可证。