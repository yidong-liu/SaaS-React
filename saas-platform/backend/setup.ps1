# SaaS 平台后端 - 快速启动脚本（SQLite 版本）
# 此脚本会设置数据库并准备开发环境

Write-Host "🚀 SaaS 平台后端 - 快速启动" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "使用 SQLite 进行本地开发（无需 Docker）" -ForegroundColor Yellow
Write-Host ""

# 生成 Prisma Client
Write-Host "生成 Prisma Client..." -ForegroundColor Yellow
pnpm prisma generate

# 创建并运行数据库迁移
Write-Host ""
Write-Host "创建数据库迁移..." -ForegroundColor Yellow
pnpm prisma migrate dev --name init

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ 设置完成！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "下一步:" -ForegroundColor Cyan
Write-Host "1. 运行 'pnpm run dev' 启动开发服务器" -ForegroundColor White
Write-Host "2. 运行 '.\test-api.ps1' 测试 API" -ForegroundColor White
Write-Host ""
Write-Host "数据库信息:" -ForegroundColor Cyan
Write-Host "- 类型: SQLite" -ForegroundColor White
Write-Host "- 文件: ./dev.db" -ForegroundColor White
Write-Host ""
Write-Host "查看数据库: pnpm prisma studio" -ForegroundColor Yellow
Write-Host ""
Write-Host "如需使用 PostgreSQL:" -ForegroundColor Yellow
Write-Host "1. 安装 Docker Desktop" -ForegroundColor White
Write-Host "2. 运行 'docker-compose up -d'" -ForegroundColor White
Write-Host "3. 修改 .env 文件中的 DATABASE_URL" -ForegroundColor White
Write-Host "4. 修改 prisma/schema.prisma 中的 provider 为 'postgresql'" -ForegroundColor White
