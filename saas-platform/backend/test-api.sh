#!/bin/bash

# SaaS 平台用户服务 - API 测试脚本
# 使用方法: bash test-api.sh

# 配置
API_URL="http://localhost:3000/api/v1"
TENANT_ID=""
USER_ID=""
ROLE_ID=""

echo "🚀 SaaS 平台用户服务 API 测试"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 简单的 JSON 解析函数（不需要 jq）
extract_id() {
    echo "$1" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4
}

extract_field() {
    local json="$1"
    local field="$2"
    echo "$json" | grep -o "\"$field\":\"[^\"]*\"" | cut -d'"' -f4
}

# 测试 1: 初始化默认权限
echo -e "${BLUE}测试 1: 初始化默认权限${NC}"
PERM_RESPONSE=$(curl -s -X POST $API_URL/permissions/seed)
echo "$PERM_RESPONSE"
if echo "$PERM_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ 成功${NC}"
else
    echo -e "${RED}❌ 失败${NC}"
fi
echo ""

# 测试 2: 创建租户
echo -e "${BLUE}测试 2: 创建租户${NC}"
RANDOM_SLUG="test-company-$RANDOM"
TENANT_RESPONSE=$(curl -s -X POST $API_URL/tenants \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"测试公司\",
    \"slug\": \"$RANDOM_SLUG\"
  }")

echo "$TENANT_RESPONSE"

# 提取租户 ID
TENANT_ID=$(extract_id "$TENANT_RESPONSE")
if [ -n "$TENANT_ID" ]; then
    echo -e "${GREEN}✅ 租户创建成功${NC}"
    echo -e "${GREEN}租户 ID: $TENANT_ID${NC}"
    echo -e "${GREEN}Slug: $RANDOM_SLUG${NC}"
else
    echo -e "${RED}❌ 租户创建失败${NC}"
fi
echo ""

# 测试 3: 获取租户的角色列表
echo -e "${BLUE}测试 3: 获取角色列表${NC}"
ROLES_RESPONSE=$(curl -s -X GET $API_URL/roles \
  -H "x-tenant-id: $TENANT_ID")

echo "$ROLES_RESPONSE"

# 提取 Admin 角色 ID（简单方法）
ROLE_ID=$(echo "$ROLES_RESPONSE" | grep -o '"id":"[^"]*","tenantId":"[^"]*","name":"Admin"' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$ROLE_ID" ]; then
    echo -e "${GREEN}✅ 成功获取角色${NC}"
    echo -e "${GREEN}Admin 角色 ID: $ROLE_ID${NC}"
else
    echo -e "${RED}❌ 未找到 Admin 角色${NC}"
fi
echo ""

# 测试 4: 创建管理员用户
echo -e "${BLUE}测试 4: 创建管理员用户${NC}"
RANDOM_EMAIL="admin-$RANDOM@test.com"
USER_RESPONSE=$(curl -s -X POST $API_URL/users \
  -H "Content-Type: application/json" \
  -d "{
    \"tenantId\": \"$TENANT_ID\",
    \"email\": \"$RANDOM_EMAIL\",
    \"password\": \"Admin123!@#\",
    \"firstName\": \"Admin\",
    \"lastName\": \"User\",
    \"roleIds\": [\"$ROLE_ID\"]
  }")

echo "$USER_RESPONSE"

# 提取用户 ID
USER_ID=$(extract_id "$USER_RESPONSE")
if [ -n "$USER_ID" ]; then
    echo -e "${GREEN}✅ 用户创建成功${NC}"
    echo -e "${GREEN}用户 ID: $USER_ID${NC}"
    echo -e "${GREEN}邮箱: $RANDOM_EMAIL${NC}"
else
    echo -e "${RED}❌ 用户创建失败${NC}"
fi
echo ""

# 测试 5: 获取用户列表
echo -e "${BLUE}测试 5: 获取用户列表${NC}"
USERS_RESPONSE=$(curl -s -X GET "$API_URL/users?page=1&limit=10" \
  -H "x-tenant-id: $TENANT_ID")
echo "$USERS_RESPONSE"
if echo "$USERS_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ 成功${NC}"
else
    echo -e "${RED}❌ 失败${NC}"
fi
echo ""

# 测试 6: 获取用户权限
if [ -n "$USER_ID" ]; then
    echo -e "${BLUE}测试 6: 获取用户权限${NC}"
    PERMS_RESPONSE=$(curl -s -X GET "$API_URL/users/$USER_ID/permissions" \
      -H "x-tenant-id: $TENANT_ID")
    echo "$PERMS_RESPONSE"
    if echo "$PERMS_RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ 成功${NC}"
    else
        echo -e "${RED}❌ 失败${NC}"
    fi
    echo ""
fi

# 测试 7: 获取所有权限
echo -e "${BLUE}测试 7: 获取所有权限${NC}"
ALL_PERMS=$(curl -s -X GET "$API_URL/permissions")
echo "$ALL_PERMS"
if echo "$ALL_PERMS" | grep -q '"success":true'; then
    PERM_COUNT=$(echo "$ALL_PERMS" | grep -o '"id":"[^"]*"' | wc -l)
    echo -e "${GREEN}✅ 成功 (权限总数: $PERM_COUNT)${NC}"
else
    echo -e "${RED}❌ 失败${NC}"
fi
echo ""

# 测试 8: 创建新角色
echo -e "${BLUE}测试 8: 创建新角色${NC}"
EDITOR_NAME="Editor-$RANDOM"
EDITOR_RESPONSE=$(curl -s -X POST $API_URL/roles \
  -H "Content-Type: application/json" \
  -d "{
    \"tenantId\": \"$TENANT_ID\",
    \"name\": \"$EDITOR_NAME\",
    \"description\": \"可以编辑内容\"
  }")

echo "$EDITOR_RESPONSE"

# 提取角色 ID
EDITOR_ROLE_ID=$(extract_id "$EDITOR_RESPONSE")
if [ -n "$EDITOR_ROLE_ID" ]; then
    echo -e "${GREEN}✅ 角色创建成功${NC}"
    echo -e "${GREEN}Editor 角色 ID: $EDITOR_ROLE_ID${NC}"
else
    echo -e "${RED}❌ 角色创建失败${NC}"
fi
echo ""

# 测试 9: 获取租户统计
if [ -n "$TENANT_ID" ]; then
    echo -e "${BLUE}测试 9: 获取租户统计${NC}"
    STATS_RESPONSE=$(curl -s -X GET "$API_URL/tenants/$TENANT_ID/stats")
    echo "$STATS_RESPONSE"
    if echo "$STATS_RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ 成功${NC}"
    else
        echo -e "${RED}❌ 失败${NC}"
    fi
    echo ""
fi

# 总结
echo "================================"
echo -e "${GREEN}📊 测试摘要${NC}"
echo "================================"
echo ""
echo "创建的资源:"
if [ -n "$TENANT_ID" ]; then
    echo -e "  ${GREEN}✅ 租户 ID: $TENANT_ID${NC}"
else
    echo -e "  ${RED}❌ 租户未创建${NC}"
fi

if [ -n "$USER_ID" ]; then
    echo -e "  ${GREEN}✅ 管理员用户 ID: $USER_ID${NC}"
else
    echo -e "  ${RED}❌ 管理员用户未创建${NC}"
fi

if [ -n "$ROLE_ID" ]; then
    echo -e "  ${GREEN}✅ Admin 角色 ID: $ROLE_ID${NC}"
else
    echo -e "  ${RED}❌ Admin 角色未获取${NC}"
fi

if [ -n "$EDITOR_ROLE_ID" ]; then
    echo -e "  ${GREEN}✅ Editor 角色 ID: $EDITOR_ROLE_ID${NC}"
fi

echo ""
echo -e "${YELLOW}💡 提示: 如果有测试失败，请检查:${NC}"
echo "   1. 服务器是否正在运行 (pnpm run dev)"
echo "   2. 数据库连接是否正常"
echo "   3. 查看服务器日志了解详细错误"
echo ""
echo -e "${BLUE}💡 注意: 推荐使用 PowerShell 版本测试脚本${NC}"
echo "   PowerShell: .\\test-api.ps1"
echo "   Bash: bash test-api.sh"
echo ""
