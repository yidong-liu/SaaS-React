# 🚀 快速开始指南

## ⚡ 最快方式（5分钟完成）

### 第 1 步：获取免费数据库

1. **打开浏览器访问：** https://neon.tech
2. **注册账号：** 点击 "Sign up"（可使用 GitHub 账号快速注册）
3. **创建项目：**
   - 登录后会自动创建第一个项目
   - 或点击 "Create Project" 创建新项目
4. **获取连接字符串：**
   - 在项目页面找到 "Connection Details"
   - 复制 "Connection string" （示例格式）:

   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 第 2 步：配置环境变量

1. 打开 `backend\.env` 文件
2. 找到 `DATABASE_URL` 这一行
3. 替换为你从 Neon 复制的连接字符串：
   ```env
   DATABASE_URL="你复制的连接字符串"
   ```

### 第 3 步：设置数据库

在 PowerShell 中运行（在 backend 目录）：

```powershell
# 生成 Prisma Client
pnpm prisma generate

# 创建数据库表
pnpm prisma migrate dev --name init
```

### 第 4 步：启动服务器

```powershell
pnpm run dev
```

服务器将在 http://localhost:3000 启动

### 第 5 步：测试 API

打开新的 PowerShell 窗口：

```powershell
cd D:\workspace\SaaS-React\saas-platform\backend
.\test-api.ps1
```

---

## 📋 完整命令清单

```powershell
# 1. 确保在正确的目录
cd D:\workspace\SaaS-React\saas-platform\backend

# 2. 生成 Prisma Client
pnpm prisma generate

# 3. 运行数据库迁移
pnpm prisma migrate dev --name init

# 4. 启动开发服务器
pnpm run dev

# 5. (新窗口) 运行 API 测试
.\test-api.ps1
```

---

## 🔍 验证设置

运行此命令测试数据库连接：

```powershell
.\test-db.ps1
```

查看数据库内容（图形界面）：

```powershell
pnpm prisma studio
```

---

## ❌ 常见问题

### 问题 1: "Environment variable not found: DATABASE_URL"

**解决方法：**

1. 确认 `.env` 文件存在
2. 确认 `DATABASE_URL` 已正确配置
3. 重启开发服务器

### 问题 2: "Can't reach database server"

**解决方法：**

1. 检查网络连接
2. 确认连接字符串正确（包含 `?sslmode=require`）
3. 确认 Neon 项目状态为 Active

### 问题 3: "test-api.sh: line 35: jq: command not found"

**解决方法：**
使用 PowerShell 脚本代替：

```powershell
.\test-api.ps1
```

### 问题 4: Prisma 迁移失败

**解决方法：**

```powershell
# 重置并重新迁移
pnpm prisma migrate reset
pnpm prisma migrate dev --name init
```

---

## 🎯 下一步

设置完成后，你可以：

- ✅ 使用 Prisma Studio 查看数据：`pnpm prisma studio`
- ✅ 查看 API 文档：服务器启动后访问 `/api`
- ✅ 运行测试：`.\test-api.ps1`
- ✅ 查看日志：开发服务器会实时显示日志

---

## 📚 参考文档

- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - 详细数据库设置说明
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始指南
- [README.md](./README.md) - 项目总览

---

## 🆘 需要帮助？

如果遇到问题：

1. 查看错误日志
2. 运行 `.\test-db.ps1` 测试数据库
3. 检查 `.env` 文件配置
4. 重启开发服务器

---

**祝你开发愉快！** 🚀
