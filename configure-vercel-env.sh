#!/bin/bash

# 配置 Vercel 环境变量脚本
# 需要先在 Vercel Dashboard 中获取 Supabase 的 URL 和 ANON_KEY

echo "请在 Vercel Dashboard 中添加以下环境变量："
echo ""
echo "1. NEXT_PUBLIC_SUPABASE_URL"
echo "   - 值：https://zcncfrlaqikosawjdvda.supabase.co"
echo ""
echo "2. NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - 值：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4OTg5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
echo ""
echo "配置步骤："
echo "1. 打开 https://vercel.com/dashboard"
echo "2. 选择 zhuchi 项目"
echo "3. 进入 Settings → Environment Variables"
echo "4. 点击 'Add' 按钮，添加上述两个环境变量"
echo "5. 重新部署项目"
echo ""
echo "或者使用命令行添加："
echo "vercel env add NEXT_PUBLIC_SUPABASE_URL"
echo "vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"