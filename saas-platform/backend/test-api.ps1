# SaaS 平台用户服务 - API 测试脚本 (PowerShell 版本)
# 使用方法: .\test-api.ps1

$API_URL = "http://localhost:3001/api/v1"
$TENANT_ID = ""
$USER_ID = ""
$ROLE_ID = ""

Write-Host "🚀 SaaS 平台用户服务 API 测试" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 测试 1: 初始化默认权限
Write-Host "测试 1: 初始化默认权限" -ForegroundColor Blue
Invoke-RestMethod -Uri "$API_URL/permissions/seed" -Method Post
Write-Host ""

# 测试 2: 创建租户
Write-Host "测试 2: 创建租户" -ForegroundColor Blue
$tenantBody = @{
    name = "测试公司"
    slug = "test-company"
} | ConvertTo-Json

$tenantResponse = Invoke-RestMethod -Uri "$API_URL/tenants" -Method Post `
    -ContentType "application/json" -Body $tenantBody

$tenantResponse | ConvertTo-Json -Depth 10
$TENANT_ID = $tenantResponse.data.id
Write-Host "租户 ID: $TENANT_ID" -ForegroundColor Green
Write-Host ""

# 测试 3: 获取租户的角色列表
Write-Host "测试 3: 获取角色列表" -ForegroundColor Blue
$rolesResponse = Invoke-RestMethod -Uri "$API_URL/roles" -Method Get `
    -Headers @{ "x-tenant-id" = $TENANT_ID }

$rolesResponse | ConvertTo-Json -Depth 10
$ROLE_ID = ($rolesResponse.data | Where-Object { $_.name -eq "Admin" }).id
Write-Host "Admin 角色 ID: $ROLE_ID" -ForegroundColor Green
Write-Host ""

# 测试 4: 创建管理员用户
Write-Host "测试 4: 创建管理员用户" -ForegroundColor Blue
$adminBody = @{
    tenantId = $TENANT_ID
    email = "admin@test.com"
    password = "Admin123!@#"
    firstName = "Admin"
    lastName = "User"
    roleIds = @($ROLE_ID)
} | ConvertTo-Json

$userResponse = Invoke-RestMethod -Uri "$API_URL/users" -Method Post `
    -ContentType "application/json" -Body $adminBody

$userResponse | ConvertTo-Json -Depth 10
$USER_ID = $userResponse.data.id
Write-Host "用户 ID: $USER_ID" -ForegroundColor Green
Write-Host ""

# 测试 5: 获取用户列表
Write-Host "测试 5: 获取用户列表" -ForegroundColor Blue
$usersResponse = Invoke-RestMethod -Uri "$API_URL/users?page=1&limit=10" -Method Get `
    -Headers @{ "x-tenant-id" = $TENANT_ID }
$usersResponse | ConvertTo-Json -Depth 10
Write-Host ""

# 测试 6: 获取用户权限
Write-Host "测试 6: 获取用户权限" -ForegroundColor Blue
$permissionsResponse = Invoke-RestMethod -Uri "$API_URL/users/$USER_ID/permissions" -Method Get `
    -Headers @{ "x-tenant-id" = $TENANT_ID }
$permissionsResponse | ConvertTo-Json -Depth 10
Write-Host ""

# 测试 7: 获取所有权限
Write-Host "测试 7: 获取所有权限" -ForegroundColor Blue
$allPermissions = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Get
$allPermissions | ConvertTo-Json -Depth 10
Write-Host ""

# 测试 8: 创建新角色
Write-Host "测试 8: 创建新角色" -ForegroundColor Blue
$editorBody = @{
    tenantId = $TENANT_ID
    name = "Editor"
    description = "可以编辑内容"
} | ConvertTo-Json

$editorResponse = Invoke-RestMethod -Uri "$API_URL/roles" -Method Post `
    -ContentType "application/json" -Body $editorBody

$editorResponse | ConvertTo-Json -Depth 10
$EDITOR_ROLE_ID = $editorResponse.data.id
Write-Host "Editor 角色 ID: $EDITOR_ROLE_ID" -ForegroundColor Green
Write-Host ""

# 测试 9: 获取租户统计
Write-Host "测试 9: 获取租户统计" -ForegroundColor Blue
$stats = Invoke-RestMethod -Uri "$API_URL/tenants/$TENANT_ID/stats" -Method Get
$stats | ConvertTo-Json -Depth 10
Write-Host ""

# 测试 10: 检查用户权限
Write-Host "测试 10: 检查用户权限 (user:create)" -ForegroundColor Blue
$checkPerm = Invoke-RestMethod -Uri "$API_URL/check-permission?userId=$USER_ID&resource=user&action=create" -Method Get
$checkPerm | ConvertTo-Json -Depth 10
Write-Host ""

# 测试 11: 创建普通用户
Write-Host "测试 11: 创建普通用户" -ForegroundColor Blue
$normalUserBody = @{
    tenantId = $TENANT_ID
    email = "user@test.com"
    password = "User123!@#"
    firstName = "Normal"
    lastName = "User"
} | ConvertTo-Json

$normalUserResponse = Invoke-RestMethod -Uri "$API_URL/users" -Method Post `
    -ContentType "application/json" -Body $normalUserBody

$normalUserResponse | ConvertTo-Json -Depth 10
$NORMAL_USER_ID = $normalUserResponse.data.id
Write-Host ""

# 测试 12: 给用户分配角色
Write-Host "测试 12: 给普通用户分配 Editor 角色" -ForegroundColor Blue
$assignRoleBody = @{
    roleIds = @($EDITOR_ROLE_ID)
} | ConvertTo-Json

$assignResponse = Invoke-RestMethod -Uri "$API_URL/users/$NORMAL_USER_ID/roles" -Method Post `
    -ContentType "application/json" -Body $assignRoleBody `
    -Headers @{ "x-tenant-id" = $TENANT_ID }

$assignResponse | ConvertTo-Json -Depth 10
Write-Host ""

# 测试 13: 更新用户信息
Write-Host "测试 13: 更新用户信息" -ForegroundColor Blue
$updateBody = @{
    firstName = "Updated"
    lastName = "Name"
} | ConvertTo-Json

$updateResponse = Invoke-RestMethod -Uri "$API_URL/users/$NORMAL_USER_ID" -Method Put `
    -ContentType "application/json" -Body $updateBody `
    -Headers @{ "x-tenant-id" = $TENANT_ID }

$updateResponse | ConvertTo-Json -Depth 10
Write-Host ""

# 测试 14: 获取角色的权限
Write-Host "测试 14: 获取 Admin 角色的权限" -ForegroundColor Blue
$rolePermissions = Invoke-RestMethod -Uri "$API_URL/roles/$ROLE_ID/permissions" -Method Get `
    -Headers @{ "x-tenant-id" = $TENANT_ID }
$rolePermissions | ConvertTo-Json -Depth 10
Write-Host ""

Write-Host "================================" -ForegroundColor Green
Write-Host "✅ 所有测试完成！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "创建的资源:"
Write-Host "- 租户 ID: $TENANT_ID"
Write-Host "- 管理员用户 ID: $USER_ID"
Write-Host "- 普通用户 ID: $NORMAL_USER_ID"
Write-Host "- Admin 角色 ID: $ROLE_ID"
Write-Host "- Editor 角色 ID: $EDITOR_ROLE_ID"
Write-Host ""
Write-Host "登录信息:"
Write-Host "- 管理员: admin@test.com / Admin123!@#"
Write-Host "- 普通用户: user@test.com / User123!@#"
