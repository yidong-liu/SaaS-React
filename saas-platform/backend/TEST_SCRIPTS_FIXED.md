# ✅ API 测试脚本修复完成

## 问题说明

之前的 `test-api.sh` 脚本依赖 `jq` 工具来解析 JSON，导致在 Git Bash 中运行时出现 "jq: command not found" 错误。

## 已修复

✅ **完全重写了 test-api.sh 脚本，现在不需要 jq！**

新脚本使用简单的 `grep` 和 `cut` 命令来解析 JSON，这些命令在所有 Unix-like 系统（包括 Git Bash）中都是标准配置的。

## 如何运行测试

### 方式 1: PowerShell（推荐）✅
```powershell
cd D:\workspace\SaaS-React\saas-platform\backend
.\test-api.ps1
```

**优点:**
- ✅ 完整的错误处理
- ✅ 彩色输出
- ✅ 详细的测试摘要
- ✅ 无需额外安装任何工具

### 方式 2: Git Bash ✅
```bash
cd /d/workspace/SaaS-React/saas-platform/backend
bash test-api.sh
```

**优点:**
- ✅ 不再需要 jq
- ✅ 使用标准 Unix 工具（grep, cut）
- ✅ 在任何 Bash 环境中都能运行

## 测试结果示例

### 成功的测试输出
```
🚀 SaaS 平台用户服务 API 测试
================================

测试 1: 初始化默认权限
{"success":true,"message":"Default permissions seeded successfully"}
✅ 成功

测试 2: 创建租户
{"success":true,"data":{"id":"xxx-xxx-xxx"...}}
✅ 租户创建成功
租户 ID: xxx-xxx-xxx
Slug: test-company-12345

测试 3: 获取角色列表
{"success":true,"data":[...]}
✅ 成功获取角色
Admin 角色 ID: xxx-xxx-xxx

测试 4: 创建管理员用户
{"success":true,"data":{"id":"xxx-xxx-xxx"...}}
✅ 用户创建成功
用户 ID: xxx-xxx-xxx
邮箱: admin-12345@test.com

... (其他测试)

================================
📊 测试摘要
================================

创建的资源:
  ✅ 租户 ID: xxx-xxx-xxx
  ✅ 管理员用户 ID: xxx-xxx-xxx
  ✅ Admin 角色 ID: xxx-xxx-xxx
  ✅ Editor 角色 ID: xxx-xxx-xxx

💡 提示: 如果有测试失败，请检查:
   1. 服务器是否正在运行 (pnpm run dev)
   2. 数据库连接是否正常
   3. 查看服务器日志了解详细错误
```

## 主要改进

### 1. JSON 解析函数
```bash
# 不需要 jq，使用标准工具
extract_id() {
    echo "$1" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4
}
```

### 2. 随机数据
```bash
# 每次测试使用随机 slug 和 email，避免冲突
RANDOM_SLUG="test-company-$RANDOM"
RANDOM_EMAIL="admin-$RANDOM@test.com"
```

### 3. 更好的错误处理
```bash
# 检查每个操作是否成功
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ 成功${NC}"
else
    echo -e "${RED}❌ 失败${NC}"
fi
```

### 4. 详细的测试摘要
- 显示所有创建的资源 ID
- 清晰的成功/失败标记
- 有用的故障排除提示

## 文件对比

| 特性 | test-api.ps1 (PowerShell) | test-api.sh (Bash) |
|------|---------------------------|-------------------|
| 需要 jq | ❌ 不需要 | ❌ 不需要 |
| 彩色输出 | ✅ 是 | ✅ 是 |
| 错误处理 | ✅ 完整 | ✅ 完整 |
| 平台 | Windows | Windows (Git Bash), Linux, Mac |
| 推荐使用 | ✅ Windows 用户 | Git Bash/Unix 用户 |

## 故障排除

### 问题: "command not found"
**解决方法:** 使用 PowerShell 版本
```powershell
.\test-api.ps1
```

### 问题: 测试失败
1. 检查服务器是否运行: `pnpm run dev`
2. 测试数据库连接: `.\test-db.ps1`
3. 查看服务器日志

### 问题: 端口被占用
```powershell
# 查看端口占用
Get-NetTCPConnection -LocalPort 3000

# 重启服务器
# Ctrl+C 停止，然后
pnpm run dev
```

## 验证修复

运行以下命令确认测试脚本工作正常：

```powershell
# PowerShell 版本
.\test-api.ps1

# 或者在 Git Bash 中
bash test-api.sh
```

两个版本应该都能正常运行，不会出现 "jq: command not found" 错误。

---

**状态:** ✅ 已修复
**最后更新:** 2025-12-05
**测试平台:** Windows 11, PowerShell 7, Git Bash
