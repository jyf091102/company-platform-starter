# Architecture

```text
Browser → Cloudflare Pages (static UI)
        → Pages Functions (/api/*)
        → Supabase Auth / Postgres (RLS)
```

静态页面不得持有服务端密钥。浏览器只携带短期用户会话；Functions 在每次请求中验证令牌；Postgres RLS 是最终数据边界。生产系统还应增加审计日志、速率限制、结构化错误、可观测性和数据保留策略。

视觉层使用独立的 CSS 变量和通用系统字体，未沿用来源项目的色板、品牌字体、图标、图片、动效或组件命名。采用者应在发布前替换示例公司名，并根据自身品牌系统重新定义主题变量。

仓库刻意不包含邮件系统、KYC 文件上传、投资数据模型或 AI 客服实现，因为这些功能的安全与合规设计高度依赖具体业务和司法辖区。
