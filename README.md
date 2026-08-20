# Company Platform Starter

面向现代企业官网与客户门户的安全起步模板。

它把品牌展示、客户入口、边缘 API、身份验证边界和数据库行级权限组织在一个足够小、容易理解的仓库中。你可以把它作为新项目的技术底座，再按业务需要加入内容管理、工单、资料中心或其他受保护功能。

> 本仓库是经过彻底脱敏的通用项目骨架，仅包含示例品牌和演示数据，不含真实公司资料、人员信息、客户数据、生产域名、项目 ID、访问凭据或来源项目历史。

## 为什么使用它

企业网站通常会从静态宣传页逐渐扩展出登录、资料、数据查询和后台接口。如果缺少清晰边界，前端配置、用户身份和数据库权限很容易混在一起。本项目提供一条明确的演进路径：

- Cloudflare Pages 托管公共页面，保持简单、快速和低成本。
- Pages Functions 承担服务端逻辑，不在浏览器中保存服务端密钥。
- Supabase Auth 管理用户身份，API 在每次请求中验证访问令牌。
- PostgreSQL Row Level Security 是最终数据授权边界。
- GitHub Actions 持续执行测试和敏感信息检查。

## 适用场景

- 企业官网、工作室网站或产品介绍站
- 带登录入口的客户服务门户
- Cloudflare Pages + Supabase 概念验证
- 需要安全基线、CI 和 RLS 示例的内部原型
- 从纯静态页面逐步演进到轻量全栈应用的团队

本模板不直接提供支付、KYC、邮件服务器、投资交易、医疗数据等高风险业务实现。这些能力必须根据具体业务和适用法规独立设计。

## 核心能力

| 模块 | 已提供能力 | 扩展方向 |
| --- | --- | --- |
| 企业官网 | 响应式首页、服务介绍、品牌占位内容 | CMS、新闻、SEO、国际化 |
| 客户门户 | 项目、报价、订单、发票和服务请求界面 | 实时业务数据、文件中心 |
| 客户资料 | 企业背景、需求与沟通偏好表单 | CRM 同步、资料审核流程 |
| 智能客服 | 通用知识回复、AI 翻译和人工转接骨架 | 知识库、实时坐席、质量审计 |
| 员工后台 | 客户服务队列与最小权限说明 | 角色管理、内容管理、报表 |
| 边缘 API | 登录、注册、资料保存与客服路由 | 限流、审计日志、通知任务 |
| 身份与数据 | Supabase Auth 集成、Profile 表、RLS | 角色权限、组织隔离、MFA |
| 安全基线 | CSP、安全响应头、环境变量模板 | WAF、Bot 防护、监控告警 |
| 工程质量 | Node 原生测试、静态扫描、GitHub Actions | E2E、依赖审计、部署门禁 |
| 视觉系统 | 暖灰与绿色中性主题、CSS 变量 | 品牌色、组件库、暗色模式 |

## 系统架构

```text
┌──────────────────────┐
│      Web Browser     │
│ Public UI + User JWT │
└──────────┬───────────┘
           │ HTTPS
           ▼
┌──────────────────────┐
│   Cloudflare Pages   │
│ Static HTML and CSS  │
└──────────┬───────────┘
           │ /api/*
           ▼
┌──────────────────────┐
│   Pages Functions    │
│ Validate + Authorize │
└──────────┬───────────┘
           │ authenticated request
           ▼
┌──────────────────────┐
│       Supabase       │
│ Auth + Postgres RLS  │
└──────────────────────┘
```

浏览器负责展示和携带短期用户会话，Functions 负责验证请求，RLS 负责限制数据访问。任何一层都不能单独代替其他层的授权检查。

详细设计见 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)，发布前清单见 [`docs/SECURITY.md`](docs/SECURITY.md)。

## 文件架构

```text
company-platform-starter/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions：测试与静态检查
├── docs/
│   ├── ARCHITECTURE.md            # 系统边界、数据流与扩展原则
│   └── SECURITY.md                # 上线前安全检查清单
├── functions/
│   └── api/
│       ├── auth/                   # 登录与注册的服务端代理
│       ├── support/                # 客服、翻译和人工转接接口
│       ├── _shared.js              # API 校验与 Supabase 公共工具
│       ├── customer-profile.js     # 客户资料保存接口
│       ├── health.js               # 无状态健康检查接口
│       └── profile.js              # Token 验证接口示例
├── scripts/
│   └── check-site.mjs             # 必需文件与常见敏感信息扫描
├── supabase/
│   └── migrations/
│       ├── 0001_profiles.sql      # 基础 Profile 表与 RLS
│       └── 0002_customer_service_platform.sql # 客户资料与客服队列
├── test/
│   └── profile.test.mjs           # API 认证边界的 Node 原生测试
├── .env.example                   # 仅含占位值的环境变量模板
├── .gitignore                     # 排除依赖、构建物和本地凭据
├── LICENSE                        # MIT 开源许可证
├── README.md                      # 项目入口与使用说明
├── _headers                       # CSP 等 Pages 响应头
├── _routes.json                   # Pages Functions 路由范围
├── index.html                     # 公共企业官网示例
├── login.html                     # 登录与注册
├── customer-profile.html          # 普通企业客户资料表单
├── portal.html                    # 中小企业业务协作门户
├── admin.html                     # 员工工作台骨架
├── mail.html                      # 云邮件集成与鸣谢
├── app.js                         # 浏览器会话与 API 工具
├── support-widget.js              # AI 客服、翻译和转接组件
├── styles.css                     # 可换肤的全局视觉系统
├── package.json                   # 脚本、运行时版本和项目信息
└── wrangler.jsonc                 # Cloudflare Pages 配置
```

### 目录职责

- `functions/`：服务端逻辑区域。新增接口时同步补充身份验证、输入校验、错误处理和测试。
- `supabase/migrations/`：数据库结构的唯一事实来源，避免只在控制台手动修改生产结构。
- `test/`：验证授权边界；新增接口应覆盖匿名、合法用户和越权访问场景。
- `scripts/`：存放可重复执行的质量检查，包括常见密钥格式扫描。
- `docs/`：记录跨模块决策、安全假设和部署要求。
- 根目录页面：保持无构建步骤的静态前端，便于快速部署和改造。

## 快速开始

需要 Node.js 20+、一个开发用 Supabase 项目，以及可选的 Cloudflare 账号。

```bash
git clone https://github.com/jyf091102/company-platform-starter.git
cd company-platform-starter
npm run ci
```

项目没有运行时 npm 依赖，因此无需先执行 `npm install`。

复制 `.env.example` 为 `.dev.vars`，并填入独立开发项目的配置：

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_replace_me
```

`.dev.vars` 已被 Git 忽略。不要把真实密钥写入 HTML、提交记录、日志、Issue 或公开文档。

按顺序执行 `supabase/migrations/` 中的迁移，初始化 Profile、客户资料和客服请求表，然后启动本地站点：

```bash
npx wrangler pages dev .
```

常用入口：

- `/`：企业官网示例
- `/login.html`：登录与注册
- `/customer-profile.html`：普通客户资料填写
- `/portal.html`：项目、报价、订单和服务请求概览
- `/admin.html`：员工工作台骨架
- `/mail.html`：云邮件集成说明与上游鸣谢
- `/api/health`：健康检查
- `/api/profile`：需要 Bearer Token 的认证接口示例

## 云邮件鸣谢

企业邮箱集成设计参考了 [maillab/cloud-mail](https://github.com/maillab/cloud-mail)。特别感谢创作者 **eoao** 与所有贡献者以 MIT License 开源该项目。本仓库不复制上游源代码；详情见 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。

## 可用命令

```bash
npm test        # 执行 Node 原生单元测试
npm run check   # 检查必需文件与常见敏感信息
npm run ci      # 依次执行测试和静态检查
```

## 部署流程

1. 创建互相隔离的开发、预发布和生产 Supabase 项目。
2. 在目标数据库执行经过审核的迁移。
3. 在 Cloudflare Pages 中连接仓库，输出目录设为仓库根目录。
4. 在 Cloudflare 项目设置中添加所需环境变量。
5. 确认 `npm run ci` 和 GitHub Actions 通过后再部署。
6. 上线前启用分支保护、MFA、secret scanning、依赖更新、日志和告警。

## 自定义指南

- 在 `index.html` 和 `portal.html` 中替换 `Example Company` 和演示文案。
- 在 `styles.css` 的 `:root` 中修改主题变量。
- 新增静态资源前确认公开分发权，并移除图片元数据。
- 新增数据表时默认启用 RLS，先验证默认拒绝，再开放最小权限。
- 新增 API 时不要信任浏览器传来的用户 ID、角色或资源归属。
- 高风险业务功能应由安全、隐私和法律专业人员独立评审。

## 安全边界

本仓库只提供安全起点，不宣称开箱即用地满足任何行业认证或地区法规。Supabase publishable key 可以出现在客户端，但仍必须依赖正确的 RLS；服务角色密钥、私钥和第三方 API 密钥必须始终留在服务端。

发现漏洞时，请使用 GitHub Security Advisory 私下报告，不要在公开 Issue 中粘贴凭据、日志或个人数据。

## 开源许可

本项目采用 [MIT License](LICENSE)。你可以使用、修改和分发本项目，但生产部署和衍生业务的安全与合规责任由采用者承担。
