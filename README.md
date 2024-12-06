# ⚡ Sink

**一个简单/快速/安全的链接缩短器，支持分析，100%运行在Cloudflare上。**

<a href="https://trendshift.io/repositories/10421" target="_blank">
  <img
    src="https://trendshift.io/api/badge/repositories/10421"
    alt="ccbikai/Sink | Trendshift"
    style="width: 250px; height: 55px;"
    width="250"
    height="55"
  />
</a>
<a href="https://news.ycombinator.com/item?id=40843683">
  <img
    src="https://hackernews-badge.vercel.app/api?id=40843683"
    alt="在Hacker News上推荐"
    style="width: 250px; height: 55px;"
    width="250"
    height="55"
  />
</a>

![Cloudflare](https://img.shields.io/badge/Cloudflare-F69652?style=flat&logo=cloudflare&logoColor=white)
![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=flat&logo=nuxtdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white)

![Hero](./public/image.png)

----

## ✨ 特性

- **URL 缩短：** 将您的URL压缩到最小长度。
- **分析：** 监控链接分析并收集有价值的统计信息。
- **无服务器：** 部署时无需传统服务器。
- **可自定义的Slug：** 支持个性化的slug。
- **🪄 AI Slug：** 利用AI生成slug。
- **链接过期：** 为您的链接设置到期日期。

## 🪧 演示

体验演示请访问 [Sink.Cool](https://sink.cool/dashboard)。使用以下站点令牌登录：

```txt
站点令牌：SinkCool
```

<details>
  <summary><b>截图</b></summary>
  <img alt="分析" src="./docs/images/sink.cool_dashboard.png"/>
  <img alt="链接" src="./docs/images/sink.cool_dashboard_links.png"/>
  <img alt="链接分析" src="./docs/images/sink.cool_dashboard_link_slug.png"/>
</details>

## 🧱 使用的技术

- **框架：** [Nuxt](https://nuxt.com/)
- **数据库：** [Cloudflare Workers KV](https://developers.cloudflare.com/kv/)
- **分析引擎：** [Cloudflare Workers Analytics Engine](https://developers.cloudflare.com/analytics/)
- **UI 组件：** [Shadcn-vue](https://www.shadcn-vue.com/)
- **样式：** [Tailwind CSS](https://tailwindcss.com/)
- **部署：** [Cloudflare](https://www.cloudflare.com/)

## 🚗 路线图 [进行中]

欢迎您的贡献和PR。

- [x] 浏览器扩展
      - [Sink工具](https://github.com/zhuzhuyule/sink-extension)
- [x] Raycast扩展
      - [Raycast-Sink](https://github.com/foru17/raycast-sink)
- [x] 苹果快捷方式
      - [Sink Shortcuts](https://s.search1api.com/sink001)
- [ ] 增强的链接管理（使用Cloudflare D1）
- [ ] 分析增强（支持合并过滤条件）
- [ ] 仪表板性能优化（无限加载）
- [ ] 单元测试
- [ ] 支持其他部署平台

## 🏗️ 部署

> 视频教程： [点击观看](https://www.youtube.com/watch?v=MkU23U2VE9E)

1. [Fork](https://github.com/woodchen-ink/sink/fork) 此库到您的GitHub账户。
2. 在 [Cloudflare Pages](https://developers.cloudflare.com/pages/) 中创建一个项目。
3. 选择 `Sink` 仓库并选择 `Nuxt.js` 预设。
4. 配置以下环境变量：
   - `NUXT_SITE_TOKEN`：必须长于 **8** 个字符。此令牌授予访问您的仪表板的权限。
   - `NUXT_CF_ACCOUNT_ID`：查找您的 [账户ID](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/)。
   - `NUXT_CF_API_TOKEN`：创建一个 [Cloudflare API令牌](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) ，至少需要 `Account.Account Analytics` 权限。 [查看参考。](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/#authentication)

5. 保存并部署项目。
6. 取消部署，然后导航到 **设置** -> **绑定** -> **添加**：
   - **KV 命名空间**：将变量名称 `KV` 绑定到一个KV命名空间（在 **Workers & Pages** -> **KV** 中创建一个新的）。
   - **Workers AI** （_可选_）：将变量名称 `AI` 绑定到Workers AI目录。
   - **分析引擎**：
     - 在 **Workers & Pages** 中，转到右侧的 **账户详情**，找到 `分析引擎`，并单击 `设置` 启用免费版本。
     - 返回 **设置** -> **绑定** -> **添加** 并选择 **分析引擎**。
     - 将变量名称 `ANALYTICS` 绑定到 `sink` 数据集。

7. 重新部署项目。

## ⚒️ 配置

[配置文档](./docs/configuration.md)

## 🔌 API

[API 文档](./docs/api.md)

## 🙋🏻 常见问题解答

[常见问题解答](./docs/faqs.md)

## 💖 贡献

1. [**Cloudflare**](https://www.cloudflare.com/)
2. [**NuxtHub**](https://hub.nuxt.com/)
3. [**Astroship**](https://astroship.web3templates.com/)

## ☕ 赞助

1. [在X（Twitter）上关注我](https://x.com/0xKaiBi)。
2. [在GitHub上成为赞助者](https://github.com/sponsors/ccbikai)。
