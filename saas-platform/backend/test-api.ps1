# SaaS 平台用户服务 - API 测试脚本 (PowerShell 版本)
# 使用方法: .\test-api.ps1

$API_URL = "http://localhost:3000/api/v1"
$TENANT_ID = ""
$USER_ID = ""
$ROLE_ID = ""
$ErrorActionPreference = "Continue"

Write-Host "🚀 SaaS 平台用户服务 API 测试" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 测试 1: 初始化默认权限
Write-Host "测试 1: 初始化默认权限" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$API_URL/permissions/seed" -Method Post
    if ($response.success) {
        Write-Host "✅ 成功" -ForegroundColor Green
    } else {
        Write-Host "⚠️ $($response.message)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ 失败: $_" -ForegroundColor Red
}
Write-Host ""

# 测试 2: 创建租户（使用随机slug避免冲突）
Write-Host "测试 2: 创建租户" -ForegroundColor Blue
$randomSlug = "test-company-" + (Get-Random -Minimum 1000 -Maximum 9999)
$tenantBody = @{
    name = "测试公司"
    slug = $randomSlug
} | ConvertTo-Json

try {
    $tenantResponse = Invoke-RestMethod -Uri "$API_URL/tenants" -Method Post `
        -ContentType "application/json" -Body $tenantBody
    
    if ($tenantResponse.success) {
        $TENANT_ID = $tenantResponse.data.id
        Write-Host "✅ 租户创建成功" -ForegroundColor Green
        Write-Host "   租户 ID: $TENANT_ID" -ForegroundColor Gray
        Write-Host "   Slug: $randomSlug" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ 失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 测试 3: 获取租户的角色列表
Write-Host "测试 3: 获取角色列表" -ForegroundColor Blue
try {
    $rolesResponse = Invoke-RestMethod -Uri "$API_URL/roles" -Method Get `
        -Headers @{ "x-tenant-id" = $TENANT_ID }
    
    if ($rolesResponse.success -and $rolesResponse.data.Count -gt 0) {
        $adminRole = $rolesResponse.data | Where-Object { $_.name -eq "Admin" }
        if ($adminRole) {
            $ROLE_ID = $adminRole.id
            Write-Host "✅ 成功获取角色" -ForegroundColor Green
            Write-Host "   Admin 角色 ID: $ROLE_ID" -ForegroundColor Gray
            Write-Host "   总角色数: $($rolesResponse.data.Count)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ 失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 测试 4: 创建管理员用户
Write-Host "测试 4: 创建管理员用户" -ForegroundColor Blue
$randomEmail = "admin-" + (Get-Random -Minimum 1000 -Maximum 9999) + "@test.com"
$adminBody = @{
    tenantId = $TENANT_ID
    email = $randomEmail
    password = "Admin123!@#"
    firstName = "Admin"
    lastName = "User"
    roleIds = @($ROLE_ID)
} | ConvertTo-Json

try {
    $userResponse = Invoke-RestMethod -Uri "$API_URL/users" -Method Post `
        -ContentType "application/json" -Body $adminBody
    
    if ($userResponse.success) {
        $USER_ID = $userResponse.data.id
        Write-Host "✅ 用户创建成功" -ForegroundColor Green
        Write-Host "   用户 ID: $USER_ID" -ForegroundColor Gray
        Write-Host "   邮箱: $randomEmail" -ForegroundColor Gray
    }
} catch {
    $errorMsg = $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        $errorDetail = $_.ErrorDetails.Message | ConvertFrom-Json
        $errorMsg = $errorDetail.message
    }
    Write-Host "❌ 失败: $errorMsg" -ForegroundColor Red
}
Write-Host ""

# 测试 5: 获取用户列表
Write-Host "测试 5: 获取用户列表" -ForegroundColor Blue
try {
    $usersResponse = Invoke-RestMethod -Uri "$API_URL/users?page=1&limit=10" -Method Get `
        -Headers @{ "x-tenant-id" = $TENANT_ID }
    
    if ($usersResponse.success) {
        Write-Host "✅ 成功" -ForegroundColor Green
        Write-Host "   用户总数: $($usersResponse.meta.total)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ 失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 测试 6: 获取用户权限
if ($USER_ID) {
    Write-Host "测试 6: 获取用户权限" -ForegroundColor Blue
    try {
        $permissionsResponse = Invoke-RestMethod -Uri "$API_URL/users/$USER_ID/permissions" -Method Get `
            -Headers @{ "x-tenant-id" = $TENANT_ID }
        
        if ($permissionsResponse.success) {
            Write-Host "✅ 成功" -ForegroundColor Green
            Write-Host "   权限数量: $($permissionsResponse.data.Count)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ 失败: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# 测试 7: 获取所有权限
Write-Host "测试 7: 获取所有权限" -ForegroundColor Blue
try {
    $allPermissions = Invoke-RestMethod -Uri "$API_URL/permissions" -Method Get
    
    if ($allPermissions.success) {
        Write-Host "✅ 成功" -ForegroundColor Green
        Write-Host "   系统权限总数: $($allPermissions.data.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ 失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 测试 8: 创建新角色
Write-Host "测试 8: 创建新角色" -ForegroundColor Blue
$editorBody = @{
    tenantId = $TENANT_ID
    name = "Editor-" + (Get-Random -Minimum 100 -Maximum 999)
    description = "可以编辑内容"
} | ConvertTo-Json

try {
    $editorResponse = Invoke-RestMethod -Uri "$API_URL/roles" -Method Post `
        -ContentType "application/json" -Body $editorBody
    
    if ($editorResponse.success) {
        $EDITOR_ROLE_ID = $editorResponse.data.id
        Write-Host "✅ 角色创建成功" -ForegroundColor Green
        Write-Host "   Editor 角色 ID: $EDITOR_ROLE_ID" -ForegroundColor Gray
    }
} catch {
    $errorMsg = $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        $errorDetail = $_.ErrorDetails.Message | ConvertFrom-Json
        $errorMsg = $errorDetail.message
    }
    Write-Host "❌ 失败: $errorMsg" -ForegroundColor Red
}
Write-Host ""

# 测试 9: 获取租户统计
if ($TENANT_ID) {
    Write-Host "测试 9: 获取租户统计" -ForegroundColor Blue
    try {
        $stats = Invoke-RestMethod -Uri "$API_URL/tenants/$TENANT_ID/stats" -Method Get
        
        if ($stats.success) {
            Write-Host "✅ 成功" -ForegroundColor Green
            Write-Host "   统计信息: " -ForegroundColor Gray
            $stats.data | ConvertTo-Json -Depth 2 | Write-Host -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ 失败: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# 总结
Write-Host "================================" -ForegroundColor Green
Write-Host "📊 测试摘要" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "创建的资源:"
if ($TENANT_ID) {
    Write-Host "  ✅ 租户 ID: $TENANT_ID" -ForegroundColor Green
} else {
    Write-Host "  ❌ 租户未创建" -ForegroundColor Red
}

if ($USER_ID) {
    Write-Host "  ✅ 管理员用户 ID: $USER_ID" -ForegroundColor Green
} else {
    Write-Host "  ❌ 管理员用户未创建" -ForegroundColor Red
}

if ($ROLE_ID) {
    Write-Host "  ✅ Admin 角色 ID: $ROLE_ID" -ForegroundColor Green
} else {
    Write-Host "  ❌ Admin 角色未获取" -ForegroundColor Red
}

if ($EDITOR_ROLE_ID) {
    Write-Host "  ✅ Editor 角色 ID: $EDITOR_ROLE_ID" -ForegroundColor Green
}

Write-Host ""
Write-Host "💡 提示: 如果有测试失败，请检查:" -ForegroundColor Yellow
Write-Host "   1. 服务器是否正在运行 (pnpm run dev)" -ForegroundColor White
Write-Host "   2. 数据库连接是否正常" -ForegroundColor White
Write-Host "   3. 查看服务器日志了解详细错误" -ForegroundColor White
