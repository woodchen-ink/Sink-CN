export default eventHandler(async (event) => {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  // 获取所有域名重定向规则
  const { keys } = await KV.list({ prefix: 'domain:' })
  console.log(`[Domain List Debug] Found ${keys.length} domain keys:`, keys.map((k: any) => k.name))

  const domains = await Promise.all(
    keys.map(async (key: any) => {
      const { value, metadata } = await KV.getWithMetadata(key.name, { type: 'json' })
      console.log(`[Domain List Debug] Key: ${key.name}, Value:`, value, 'Metadata:', metadata)
      return {
        ...metadata,
        ...value,
      }
    }),
  )

  // 按创建时间倒序排列
  domains.sort((a, b) => b.createdAt - a.createdAt)

  return domains
})
