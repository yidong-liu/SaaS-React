# 数据库连接测试脚本
# 此脚本帮助你测试数据库连接是否正常

Write-Host "🔍 数据库连接测试" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查 .env 文件
if (!(Test-Path ".env")) {
    Write-Host "❌ 错误: .env 文件不存在" -ForegroundColor Red
    Write-Host "请从 .env.example 复制并配置 .env 文件" -ForegroundColor Yellow
    exit 1
}

# 读取 DATABASE_URL
$envContent = Get-Content ".env" | Where-Object { $_ -match "^DATABASE_URL=" }
if (!$envContent) {
    Write-Host "❌ 错误: .env 文件中未找到 DATABASE_URL" -ForegroundColor Red
    exit 1
}

$dbUrl = $envContent -replace "^DATABASE_URL=", "" -replace '"', ''
Write-Host "数据库 URL: $dbUrl" -ForegroundColor White
Write-Host ""

# 测试连接
Write-Host "测试数据库连接..." -ForegroundColor Yellow
try {
    pnpm prisma db push --skip-generate 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 数据库连接成功！" -ForegroundColor Green
        Write-Host ""
        Write-Host "下一步:" -ForegroundColor Cyan
        Write-Host "1. 运行 'pnpm prisma generate' 生成客户端" -ForegroundColor White
        Write-Host "2. 运行 'pnpm prisma migrate dev' 创建数据库表" -ForegroundColor White
        Write-Host "3. 运行 'pnpm run dev' 启动服务器" -ForegroundColor White
    } else {
        Write-Host "❌ 数据库连接失败" -ForegroundColor Red
        Write-Host ""
        Write-Host "可能的原因:" -ForegroundColor Yellow
        Write-Host "1. 数据库服务未运行" -ForegroundColor White
        Write-Host "2. 连接字符串配置错误" -ForegroundColor White
        Write-Host "3. 网络问题（如使用在线数据库）" -ForegroundColor White
        Write-Host ""
        Write-Host "请查看 DATABASE_SETUP.md 获取详细设置说明" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ 测试失败: $_" -ForegroundColor Red
}
