# 数据库设置指南

## 快速开始 - 3种方式

### 方式 1: 免费在线 PostgreSQL（推荐 - 无需安装）

#### 使用 Neon (推荐)
1. 访问 https://neon.tech
2. 注册免费账号
3. 创建新项目
4. 复制连接字符串 (类似: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb`)
5. 更新 `.env` 文件中的 `DATABASE_URL`
6. 运行设置脚本

```powershell
# 设置数据库
pnpm prisma generate
pnpm prisma migrate dev --name init

# 启动服务
pnpm run dev

# 运行测试
.\test-api.ps1
```

#### 使用 Supabase
1. 访问 https://supabase.com
2. 创建新项目
3. 在 Project Settings > Database 中找到连接字符串
4. 选择 "URI" 格式并复制
5. 更新 `.env` 文件中的 `DATABASE_URL`
6. 运行上述设置命令

---

### 方式 2: Docker（需要 Docker Desktop）

1. 安装 Docker Desktop: https://www.docker.com/products/docker-desktop

2. 启动数据库
```powershell
docker-compose up -d
```

3. 等待几秒让数据库启动完成

4. 运行设置
```powershell
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm run dev
```

5. 测试 API
```powershell
.\test-api.ps1
```

---

### 方式 3: 本地 PostgreSQL 安装

1. 下载并安装 PostgreSQL: https://www.postgresql.org/download/windows/

2. 安装时记住你设置的密码

3. 创建数据库
```powershell
# 打开 PowerShell 并运行
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres

# 在 psql 中运行
CREATE DATABASE saas_platform;
\q
```

4. 更新 `.env` 文件
```env
DATABASE_URL="postgresql://postgres:你的密码@localhost:5432/saas_platform"
```

5. 运行设置
```powershell
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm run dev
```

---

## 故障排除

### 错误: "Environment variable not found: DATABASE_URL"
- 确保 `.env` 文件存在于 `backend` 目录
- 确保 `.env` 文件中有 `DATABASE_URL` 配置
- 重启开发服务器

### 错误: "Can't reach database server"
- **Neon/Supabase**: 检查网络连接，确认连接字符串正确
- **Docker**: 运行 `docker ps` 确认容器正在运行
- **本地**: 确认 PostgreSQL 服务正在运行

### 错误: "Database does not exist"
- **Neon/Supabase**: 数据库应该已存在
- **Docker**: 重启容器 `docker-compose restart`
- **本地**: 手动创建数据库（见方式 3）

---

## 有用的命令

```powershell
# 查看数据库内容（图形界面）
pnpm prisma studio

# 重置数据库
pnpm prisma migrate reset

# 查看数据库状态
pnpm prisma migrate status

# 停止 Docker 数据库
docker-compose down

# 查看 Docker 日志
docker-compose logs -f
```

---

## 推荐使用顺序

1. **首次尝试**: 使用 Neon（无需安装，最快）
2. **团队开发**: 使用 Docker（统一环境）
3. **长期开发**: 安装本地 PostgreSQL（性能最好）
