# Company Platform Starter

一个经过脱敏的企业官网与客户门户骨架，面向 Cloudflare Pages、Pages Functions 和 Supabase。

本仓库只包含可复用架构和演示数据，不包含原项目的公司名称、人员、联系方式、域名、媒体、客户数据、生产项目 ID、密钥或 Git 历史。

## 能力

- 响应式企业官网与门户占位页
- 中性暖灰与绿色视觉主题，可通过 CSS 变量快速换肤
- Cloudflare Pages Functions 健康检查和受控 API 示例
- Supabase 表结构与 Row Level Security 示例
- 安全响应头、最小路由配置和 GitHub Actions CI
- 零依赖静态检查与单元测试

## 快速开始

需要 Node.js 20+。

```bash
npm test
npm run check
npx wrangler pages dev .
```

复制 `.env.example` 为 `.dev.vars`，填入你自己的测试项目配置。不要提交 `.dev.vars` 或任何真实密钥。

## 目录

```text
index.html                 官网演示
portal.html                客户门户占位页
functions/api/health.js    健康检查
functions/api/profile.js   认证 API 骨架
supabase/migrations/       最小数据模型与 RLS
scripts/check-site.mjs     脱敏与完整性检查
test/                      单元测试
docs/ARCHITECTURE.md       架构说明
docs/SECURITY.md           安全与部署清单
```

## 部署

1. 创建独立 Supabase 项目并执行迁移。
2. 在 Cloudflare Pages 中配置 `SUPABASE_URL` 和 `SUPABASE_PUBLISHABLE_KEY`。
3. 将 Pages 输出目录设为仓库根目录；Functions 会自动加载。
4. 部署前运行 `npm run ci`，并启用 GitHub secret scanning 与 Dependabot。

本项目是技术模板，不提供法律、合规、金融或数据保护建议。生产使用前应按适用地区完成独立审查。

## License

MIT
