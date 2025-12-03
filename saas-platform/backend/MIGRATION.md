# 数据库迁移说明

## 运行迁移

### 1. 生成 Prisma Client
```bash
cd saas-platform/backend
pnpm prisma:generate
```

### 2. 创建迁移
```bash
pnpm prisma migrate dev --name user_service_setup
```

### 3. 查看数据库
```bash
pnpm prisma studio
```

## 迁移后初始化

### 初始化默认权限
迁移完成后，需要初始化默认权限：

```bash
# 方式 1: 通过 API (服务启动后)
curl -X POST http://localhost:3001/api/v1/permissions/seed

# 方式 2: 通过 Prisma Studio 手动添加
```

### 创建第一个租户和管理员

```bash
# 1. 创建租户
curl -X POST http://localhost:3001/api/v1/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Default Tenant",
    "slug": "default"
  }'

# 2. 获取租户 ID 和 Admin 角色 ID (通过 Prisma Studio 或 API)

# 3. 创建管理员用户
curl -X POST http://localhost:3001/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "从上一步获取的租户ID",
    "email": "admin@example.com",
    "password": "Admin123!@#",
    "firstName": "System",
    "lastName": "Administrator",
    "roleIds": ["从租户获取的Admin角色ID"]
  }'
```

## 数据库索引说明

已创建的重要索引：
- `users(tenantId, email)` - 唯一索引
- `users(tenantId)` - 查询优化
- `users(status)` - 状态过滤
- `roles(tenantId, name)` - 唯一索引
- `permissions(resource, action)` - 唯一索引
- `sessions(token)` - 快速查找
- `audit_logs(tenantId, action, createdAt)` - 审计查询优化

## 常见问题

### Q: 迁移失败怎么办？
```bash
# 重置数据库
pnpm prisma migrate reset

# 重新运行迁移
pnpm prisma migrate dev
```

### Q: 如何回滚迁移？
Prisma 不直接支持回滚，需要手动操作：
1. 删除最新的迁移文件
2. 运行 `prisma migrate dev` 重新生成

### Q: 生产环境迁移？
```bash
pnpm prisma migrate deploy
```
