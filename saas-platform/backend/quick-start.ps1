# 🚀 一键设置脚本
# 此脚本会引导你完成整个设置过程

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🚀 SaaS 平台后端 - 一键设置向导                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 检查 .env 文件
Write-Host "步骤 1: 检查环境配置" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
if (Test-Path ".env") {
    Write-Host "✅ .env 文件已存在" -ForegroundColor Green
} else {
    Write-Host "❌ .env 文件不存在，正在创建..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ 已从 .env.example 创建 .env 文件" -ForegroundColor Green
}
Write-Host ""

# 步骤 2: 选择数据库设置方式
Write-Host "步骤 2: 选择数据库设置方式" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "请选择一个选项:" -ForegroundColor White
Write-Host "  1) 使用免费在线数据库 Neon (推荐 - 无需安装)" -ForegroundColor Cyan
Write-Host "  2) 使用 Docker PostgreSQL (需要 Docker Desktop)" -ForegroundColor Cyan
Write-Host "  3) 我已经配置好数据库，跳过此步骤" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "请输入选项 (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📝 免费在线数据库设置指南:" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "1. 在浏览器中打开: https://neon.tech" -ForegroundColor White
        Write-Host "2. 点击 'Sign up' 注册免费账号（可使用 GitHub 账号）" -ForegroundColor White
        Write-Host "3. 创建新项目（Project）" -ForegroundColor White
        Write-Host "4. 在项目页面找到 'Connection String'" -ForegroundColor White
        Write-Host "5. 复制连接字符串（格式类似: postgresql://user:pass@host/db）" -ForegroundColor White
        Write-Host ""
        Write-Host "复制后，请粘贴连接字符串:" -ForegroundColor Yellow
        $dbUrl = Read-Host "DATABASE_URL"
        
        # 更新 .env 文件
        $envContent = Get-Content ".env"
        $envContent = $envContent -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$dbUrl`""
        $envContent | Set-Content ".env"
        Write-Host "✅ 数据库连接已配置" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "🐳 Docker 设置" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "正在检查 Docker..." -ForegroundColor Yellow
        try {
            docker ps | Out-Null
            Write-Host "✅ Docker 正在运行" -ForegroundColor Green
            Write-Host "正在启动 PostgreSQL 容器..." -ForegroundColor Yellow
            docker-compose up -d
            Write-Host "✅ PostgreSQL 已启动" -ForegroundColor Green
            Write-Host "等待数据库就绪..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        } catch {
            Write-Host "❌ Docker 未运行" -ForegroundColor Red
            Write-Host "请先安装并启动 Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
            exit 1
        }
    }
    "3" {
        Write-Host "跳过数据库设置..." -ForegroundColor Yellow
    }
    default {
        Write-Host "无效选项，退出..." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "步骤 3: 测试数据库连接" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "正在测试连接..." -ForegroundColor White

try {
    $testResult = pnpm prisma db push --skip-generate --accept-data-loss 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 数据库连接成功！" -ForegroundColor Green
    } else {
        Write-Host "❌ 数据库连接失败" -ForegroundColor Red
        Write-Host "错误信息: $testResult" -ForegroundColor Red
        Write-Host ""
        Write-Host "请检查:" -ForegroundColor Yellow
        Write-Host "1. 连接字符串是否正确" -ForegroundColor White
        Write-Host "2. 数据库服务是否正在运行" -ForegroundColor White
        Write-Host "3. 网络连接是否正常" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host "❌ 连接测试出错: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "步骤 4: 生成 Prisma Client" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
pnpm prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma Client 生成失败" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client 已生成" -ForegroundColor Green

Write-Host ""
Write-Host "步骤 5: 运行数据库迁移" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
pnpm prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 数据库迁移失败" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 数据库表已创建" -ForegroundColor Green

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                 🎉 设置完成！                           ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  启动开发服务器:" -ForegroundColor Yellow
Write-Host "   pnpm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  运行 API 测试:" -ForegroundColor Yellow
Write-Host "   .\test-api.ps1" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  查看数据库（可选）:" -ForegroundColor Yellow
Write-Host "   pnpm prisma studio" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "💡 提示: 服务器将运行在 http://localhost:3000" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
