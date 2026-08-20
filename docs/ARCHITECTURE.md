# Architecture

本文描述 Company Platform Starter 的系统边界、请求路径和扩展约束，不记录任何特定云账号或生产系统。

## 设计目标

- 用最少组件覆盖企业官网到客户门户的常见演进路径。
- 明确公共内容、服务端逻辑和受保护数据之间的边界。
- 默认采用最小权限，并允许功能按业务需要逐步扩展。
- 保持前端无构建依赖，降低初始维护与供应链成本。
- 让安全检查可以在本地和 CI 中重复执行。

## 逻辑架构

```text
Browser
├── Public pages: index.html, portal.html
├── Theme: styles.css
└── Short-lived user access token
          │
          ▼
Cloudflare Pages
├── Static asset delivery
├── Security headers
└── /api/* routing
          │
          ▼
Pages Functions
├── Parse and validate input
├── Validate Authorization header
├── Call services with environment bindings
└── Return minimal, non-cacheable responses
          │
          ▼
Supabase
├── Auth: user identity and sessions
└── Postgres: schema, constraints and RLS
```

## 请求生命周期

### 公共页面

1. 浏览器请求 HTML 或 CSS。
2. Cloudflare Pages 直接返回静态资源。
3. `_headers` 添加 CSP、点击劫持防护、MIME 嗅探防护和权限限制。

### 受保护 API

1. 浏览器将短期访问令牌放入 `Authorization: Bearer …` 请求头。
2. Pages Function 检查请求头格式，不接受查询参数中的令牌。
3. Function 使用环境变量验证用户身份。
4. Function 只返回页面需要的最小字段，并设置 `Cache-Control: no-store`。
5. 涉及数据表的请求还必须通过 PostgreSQL RLS。

## 信任边界

| 边界 | 可以信任 | 不可直接信任 |
| --- | --- | --- |
| 浏览器 | 用户主动输入、当前 UI 状态 | 用户 ID、角色、价格、资源归属 |
| Pages Functions | 已验证令牌、受控环境变量 | 未校验 JSON、转发头、客户端声明 |
| Supabase Auth | 签名有效且未过期的身份 | 客户端自行构造的身份字段 |
| PostgreSQL | 约束与通过测试的 RLS | 前端隐藏或路由名称形成的权限 |
| CI | 固定工作流和仓库内测试 | 日志中的外部内容、未审查的 Action |

## 数据模型

初始迁移只创建 `profiles` 表：

- `user_id` 引用 `auth.users(id)` 并作为主键。
- `display_name` 设有长度约束。
- 登录用户只能读取和更新自己的记录。
- 删除认证用户时关联 Profile 会级联删除。

新增表前应明确数据所有者、租户边界、读写角色、保留期限和审计需求，再编写 RLS。不要把 RLS 当成功能完成后的补丁。

## 配置与密钥

- `.env.example` 只能保存不可用的占位值。
- `.dev.vars` 用于本地配置，并由 `.gitignore` 排除。
- 生产配置存入 Cloudflare 环境变量或 Secrets。
- publishable key 仍需与正确的 RLS 配合。
- 服务角色密钥、私钥和第三方 API 密钥不得发送到浏览器。

## 视觉层

- `styles.css` 的 `:root` 集中定义颜色和基础主题变量。
- 页面使用通用系统字体，不依赖任何来源品牌字体。
- 示例不包含商标、真实图片、人物、图标包或追踪脚本。
- 二次开发时应检查可访问性、对比度、键盘导航和移动断点。

## 扩展原则

### 新增 API

1. 在 `functions/api/` 创建职责单一的路由。
2. 校验方法、Content-Type、Body 大小和字段类型。
3. 验证身份，并在服务端重新计算资源归属。
4. 返回稳定错误结构，不泄露堆栈或上游响应。
5. 添加匿名、合法访问和越权访问测试。

### 新增数据表

1. 通过版本化迁移创建结构和约束。
2. 立即启用 RLS。
3. 先验证默认拒绝，再添加最小读写策略。
4. 使用不同角色执行自动化权限测试。

### 新增第三方服务

1. 明确发送的数据、接收方、地区和保留期限。
2. 密钥只存服务端，并限制权限和来源。
3. 设置超时、重试上限、速率限制和降级路径。
4. 不把上游错误或敏感日志原样返回客户端。

## 刻意排除的功能

仓库不包含邮件服务器、支付、KYC 文件上传、资产或医疗数据、AI 客服以及管理员后台。这些功能涉及高度依赖业务和司法辖区的安全、隐私与合规决策，不适合作为通用默认实现。

