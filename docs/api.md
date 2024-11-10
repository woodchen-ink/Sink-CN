```markdown
# Sink API

手动编写API文档可能非常繁琐，我们将在[Nitro的OpenAPI](https://nitro.unjs.io/config#openapi)正式发布后自动生成文档。

此处提供创建短链接API的示例。其他API当前可以通过浏览器开发者工具查看。

## API 参考

### 创建短链接

```http
  POST /api/link/create
```

| Header | 描述                |
| :----- | :------------------------- |
| `authorization` | `Bearer SinkCool` |
| `content-type` | `application/json` |

#### 示例

```http
  POST /api/link/create
  HEADER authorization: Bearer SinkCool
  HEADER content-type: application/json
  BODY  {
          "url": "https://github.com/ccbikai/Sink/issues/14",
          "slug": "issue14"
        }
```

BODY数据必须是JSON格式。

```http
  RESPONSE 201
  BODY  {
          "link": {
            "id": "xpqhaurv5q",
            "url": "https://github.com/ccbikai/Sink/issues/14",
            "slug": "issue14",
            "createdAt": 1718119809,
            "updatedAt": 1718119809
          }
        }
```

| 参数 | 类型     | 描述                |
| :-------- | :------- | :------------------------- |
| `id`     | `string` | 这是由Sink自动生成的 |
| `url`    | `string`   | 这是提交URL的确认，必填。 |
| `slug`  | `string` | 这是由系统生成的slug，可以是自动生成的或根据输入（如果提供）生成的。 |
| `createdAt`     | `timestamp` | 这是用UNIX时间戳自动生成的。 |
| `updatedAt`     | `timestamp` | 这是用UNIX时间戳自动生成的。 |
```