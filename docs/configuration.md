# Sink 配置

Sink 提供了一些配置选项，可以参考 [.env.example](../.env.example)。

## `NUXT_PUBLIC_PREVIEW_MODE`

将网站设置为演示模式，生成的链接将在 24 小时后过期，并且这些链接无法编辑或删除。

## `NUXT_PUBLIC_SLUG_DEFAULT_LENGTH`

设置生成的 SLUG 的默认长度。

## `NUXT_REDIRECT_STATUS_CODE`

重定向默认使用 HTTP 301 状态码，您可以将其设置为 `302`/`307`/`308`。

## `NUXT_LINK_CACHE_TTL`

缓存链接可以加速访问，但设置时间过长可能会导致更改生效缓慢。默认值为 60 秒。

## `NUXT_REDIRECT_WITH_QUERY`

在链接重定向过程中，URL 参数默认不会携带，建议不启用此功能。

## `NUXT_HOME_URL`

默认的 Sink 首页是介绍页面，您可以用自己的网站替换它。

## `NUXT_DATASET`

Analytics Engine 数据集，不建议修改，除非您需要切换数据库并清除历史数据。

## `NUXT_AI_MODEL`

您可以自行修改大模型。支持的名称可以在 [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/#text-generation) 查看。

## `NUXT_AI_PROMPT`

支持自定义提示，建议保留占位符 {slugRegex}。

默认提示：

```txt
您是一个 URL 缩短助手，请将用户提供的 URL 缩短为 SLUG。SLUG 信息必须来自 URL 本身，不能做任何假设。SLUG 是人可读的，不应超过三个单词，并可以使用正则表达式 {slugRegex} 进行验证。只返回最佳的一个，格式必须是 JSON 引用 {"slug": "example-slug"}
```
## `NUXT_CASE_SENSITIVE`

Set URL case sensitivity.

## `NUXT_LIST_QUERY_LIMIT`

Set the maximum query data volume for the Metric list.

## `NUXT_DISABLE_BOT_ACCESS_LOG`

Access statistics do not count bot traffic.
