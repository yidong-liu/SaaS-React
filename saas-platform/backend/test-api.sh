#!/bin/bash

# SaaS 平台用户服务 - API 测试脚本
# 使用方法: bash test-api.sh

# 配置
API_URL="http://localhost:3001/api/v1"
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
NC='\033[0m' # No Color

# 测试 1: 初始化默认权限
echo -e "${BLUE}测试 1: 初始化默认权限${NC}"
curl -X POST $API_URL/permissions/seed
echo -e "\n"

# 测试 2: 创建租户
echo -e "${BLUE}测试 2: 创建租户${NC}"
TENANT_RESPONSE=$(curl -s -X POST $API_URL/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试公司",
    "slug": "test-company"
  }')
echo $TENANT_RESPONSE | jq '.'

# 提取租户 ID
TENANT_ID=$(echo $TENANT_RESPONSE | jq -r '.data.id')
echo -e "${GREEN}租户 ID: $TENANT_ID${NC}\n"

# 测试 3: 获取租户的角色列表
echo -e "${BLUE}测试 3: 获取角色列表${NC}"
ROLES_RESPONSE=$(curl -s -X GET $API_URL/roles \
  -H "x-tenant-id: $TENANT_ID")
echo $ROLES_RESPONSE | jq '.'

# 提取 Admin 角色 ID
ROLE_ID=$(echo $ROLES_RESPONSE | jq -r '.data[] | select(.name == "Admin") | .id')
echo -e "${GREEN}Admin 角色 ID: $ROLE_ID${NC}\n"

# 测试 4: 创建管理员用户
echo -e "${BLUE}测试 4: 创建管理员用户${NC}"
USER_RESPONSE=$(curl -s -X POST $API_URL/users \
  -H "Content-Type: application/json" \
  -d "{
    \"tenantId\": \"$TENANT_ID\",
    \"email\": \"admin@test.com\",
    \"password\": \"Admin123!@#\",
    \"firstName\": \"Admin\",
    \"lastName\": \"User\",
    \"roleIds\": [\"$ROLE_ID\"]
  }")
echo $USER_RESPONSE | jq '.'

# 提取用户 ID
USER_ID=$(echo $USER_RESPONSE | jq -r '.data.id')
echo -e "${GREEN}用户 ID: $USER_ID${NC}\n"

# 测试 5: 获取用户列表
echo -e "${BLUE}测试 5: 获取用户列表${NC}"
curl -s -X GET "$API_URL/users?page=1&limit=10" \
  -H "x-tenant-id: $TENANT_ID" | jq '.'
echo ""

# 测试 6: 获取用户权限
echo -e "${BLUE}测试 6: 获取用户权限${NC}"
curl -s -X GET $API_URL/users/$USER_ID/permissions \
  -H "x-tenant-id: $TENANT_ID" | jq '.'
echo ""

# 测试 7: 获取所有权限
echo -e "${BLUE}测试 7: 获取所有权限${NC}"
curl -s -X GET $API_URL/permissions | jq '.'
echo ""

# 测试 8: 创建新角色
echo -e "${BLUE}测试 8: 创建新角色${NC}"
EDITOR_ROLE=$(curl -s -X POST $API_URL/roles \
  -H "Content-Type: application/json" \
  -d "{
    \"tenantId\": \"$TENANT_ID\",
    \"name\": \"Editor\",
    \"description\": \"可以编辑内容\"
  }")
echo $EDITOR_ROLE | jq '.'
EDITOR_ROLE_ID=$(echo $EDITOR_ROLE | jq -r '.data.id')
echo -e "${GREEN}Editor 角色 ID: $EDITOR_ROLE_ID${NC}\n"

# 测试 9: 获取租户统计
echo -e "${BLUE}测试 9: 获取租户统计${NC}"
curl -s -X GET $API_URL/tenants/$TENANT_ID/stats | jq '.'
echo ""

# 测试 10: 检查用户权限
echo -e "${BLUE}测试 10: 检查用户权限 (user:create)${NC}"
curl -s -X GET "$API_URL/check-permission?userId=$USER_ID&resource=user&action=create" | jq '.'
echo ""

# 测试 11: 创建普通用户
echo -e "${BLUE}测试 11: 创建普通用户${NC}"
NORMAL_USER=$(curl -s -X POST $API_URL/users \
  -H "Content-Type: application/json" \
  -d "{
    \"tenantId\": \"$TENANT_ID\",
    \"email\": \"user@test.com\",
    \"password\": \"User123!@#\",
    \"firstName\": \"Normal\",
    \"lastName\": \"User\"
  }")
echo $NORMAL_USER | jq '.'
NORMAL_USER_ID=$(echo $NORMAL_USER | jq -r '.data.id')
echo ""

# 测试 12: 给用户分配角色
echo -e "${BLUE}测试 12: 给普通用户分配 Editor 角色${NC}"
curl -s -X POST $API_URL/users/$NORMAL_USER_ID/roles \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: $TENANT_ID" \
  -d "{
    \"roleIds\": [\"$EDITOR_ROLE_ID\"]
  }" | jq '.'
echo ""

# 测试 13: 更新用户信息
echo -e "${BLUE}测试 13: 更新用户信息${NC}"
curl -s -X PUT $API_URL/users/$NORMAL_USER_ID \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: $TENANT_ID" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }' | jq '.'
echo ""

# 测试 14: 获取角色的权限
echo -e "${BLUE}测试 14: 获取 Admin 角色的权限${NC}"
curl -s -X GET $API_URL/roles/$ROLE_ID/permissions \
  -H "x-tenant-id: $TENANT_ID" | jq '.'
echo ""

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ 所有测试完成！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "创建的资源:"
echo "- 租户 ID: $TENANT_ID"
echo "- 管理员用户 ID: $USER_ID"
echo "- 普通用户 ID: $NORMAL_USER_ID"
echo "- Admin 角色 ID: $ROLE_ID"
echo "- Editor 角色 ID: $EDITOR_ROLE_ID"
echo ""
echo "登录信息:"
echo "- 管理员: admin@test.com / Admin123!@#"
echo "- 普通用户: user@test.com / User123!@#"
