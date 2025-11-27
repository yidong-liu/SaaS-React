# SaaS Platform Frontend

## 项目概述
这是一个基于 React 和 TypeScript 的企业级 SaaS 平台前端项目。该项目旨在提供一个用户友好的界面，允许用户访问和管理他们的账户、订阅和其他相关功能。

## 技术栈
- **框架**: React 18+ with TypeScript
- **状态管理**: Redux Toolkit
- **路由**: React Router
- **样式**: Tailwind CSS / Styled-components
- **构建工具**: Vite
- **测试**: Jest + React Testing Library

## 项目结构
```
saas-platform/
├── frontend/
│   ├── public/               # 静态文件
│   ├── src/                  # 源代码
│   ├── package.json          # 项目依赖和脚本
│   ├── tsconfig.json         # TypeScript 配置
│   ├── vite.config.ts        # Vite 配置
│   ├── .env.example          # 环境变量示例
│   └── README.md             # 项目文档
└── backend/                  # 后端服务
```

## 安装与运行
1. 克隆项目：
   ```
   git clone <repository-url>
   cd saas-platform/frontend
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 启动开发服务器：
   ```
   npm run dev
   ```

4. 打开浏览器访问 `http://localhost:3000`。

## 贡献
欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证
本项目采用 MIT 许可证。