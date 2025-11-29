<!--
 * @Author: 刘易东 154659668+yidong-liu@users.noreply.github.com
 * @Date: 2025-11-27 12:16:50
 * @LastEditors: 刘易东 154659668+yidong-liu@users.noreply.github.com
 * @LastEditTime: 2025-11-29 04:42:12
 * @FilePath: /SasS-React/saas-platform/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# SasS-React
# 企业级 SaaS 平台架构设计

## 项目概述
本项目是一个企业级 SaaS 平台，包含前端和后端服务。前端使用 React 和 TypeScript 构建，后端使用 Node.js 和 TypeScript。该平台支持多租户管理、用户认证、订阅服务等核心功能。

## 目录结构
```
saas-platform/
├── frontend/                 # React 前端
│   ├── public/               # 公共文件
│   ├── src/                  # 源代码
│   ├── package.json          # 前端依赖和脚本
│   ├── tsconfig.json         # TypeScript 配置
│   ├── vite.config.ts        # Vite 配置
│   └── README.md             # 前端文档
│
├── backend/                  # Node.js 后端
│   ├── src/                  # 源代码
│   ├── package.json          # 后端依赖和脚本
│   ├── tsconfig.json         # TypeScript 配置
│   ├── Dockerfile            # Docker 配置
│   └── README.md             # 后端文档
│
├── docker-compose.yml        # Docker Compose 配置
├── .github/                  # GitHub 工作流
│   └── workflows/            # CI/CD 配置
├── .gitignore                # Git 忽略文件
└── README.md                 # 项目主文档
```

## 技术栈
- **前端**: React 18+, TypeScript, Redux Toolkit, Vite
- **后端**: Node.js 20 LTS, TypeScript, Express.js / NestJS
- **数据库**: PostgreSQL 15+, Redis 7+
- **CI/CD**: GitHub Actions
- **容器化**: Docker

## 安装与运行
1. 克隆项目：
   ```
   git clone <repository-url>
   cd saas-platform
   pnpm install
   ```

2. 前端安装：
   ```
   cd frontend
   pnpm run dev
   ```

3. 后端安装：
   ```
   cd backend
   pnpm run start
   ```

4. 使用 Docker 启动服务：
   ```
   cd /workspaces/SasS-React/saas-platform && docker compose up -d --build
   ```

## 贡献
欢迎任何形式的贡献！请提交 Pull Request 或者在 Issues 中提出建议。

## 许可证
本项目采用 MIT 许可证，详细信息请查看 LICENSE 文件。
