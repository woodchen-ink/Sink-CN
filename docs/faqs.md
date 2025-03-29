# 常见问题解答

## 1. 为什么我不能创建链接？

请检查 Cloudflare KV 绑定，KV 环境变量名称应该全部为大写字母。

<details>
  <summary><b>截图</b></summary>
  <img alt="Cloudflare中的KV绑定设置" src="/docs/images/faqs-kv.png"/>
</details>

## 2. 为什么我不能登录？

请检查 `NUXT_SITE_TOKEN` 是否设置为纯数字，Sink 不支持纯数字令牌，我们认为这不安全。

## 3. 为什么我看不到分析数据？

分析数据需要访问 Cloudflare 的设置：

1. 验证 `NUXT_CF_ACCOUNT_ID` 和 `NUXT_CF_API_TOKEN` 是否正确配置（确保账户 ID 与部署区域 ID 匹配）。
2. 检查 Worker 分析引擎是否已启用。

<details>
  <summary><b>截图</b></summary>
  <img alt="Cloudflare中的分析引擎绑定设置" src="/docs/images/faqs-Analytics_engine.png"/>
</details>

## 4. 我不想要当前的主页，可以重定向到我的博客吗？

当然可以。请将环境变量 `NUXT_HOME_URL` 设置为您的博客或官方网站地址。

## 5. 为什么我在使用 NuxtHub 部署后看不到统计信息？

NuxtHub 的 ANALYTICS 指向其数据集，您需要将 `NUXT_DATASET` 环境变量设置为指向相同的数据集。

## 6. Why are links always case-insensitive?

This is a feature of Sink. By default, we automatically convert all links to lowercase to avoid case-sensitive issues and improve usability. This ensures users don’t encounter errors due to accidental capitalization differences.

However, you can disable this feature by setting the `NUXT_CASE_SENSITIVE` environment variable to `true`.

### What happens when `NUXT_CASE_SENSITIVE` is `true`?

Newly generated links will be case-sensitive, treating `MyLink` and `mylink` as distinct. Randomly generated slugs will include both uppercase and lowercase characters, offering a larger pool of unique combinations (but not user-friendly that why we default to non-case-sensitive).

## 7. Why does the Metric list only show the top 500 data entries?

To improve query performance, we have limited the amount of data. If you need to query more data, you can adjust it through `NUXT_LIST_QUERY_LIMIT`.

## 8. I don't want to count bot or crawler traffic

Set `NUXT_DISABLE_BOT_ACCESS_LOG` to `true`.
