export default eventHandler(async (event) => {
  const { previewMode } = useRuntimeConfig(event).public
  if (previewMode) {
    throw createError({
      status: 403,
      statusText: '预览模式无法删除域名重定向规则',
    })
  }

  const { domain } = await readBody(event)
  if (!domain) {
    throw createError({
      status: 400,
      statusText: '缺少域名参数',
    })
  }

  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  // 删除域名重定向规则
  await KV.delete(`domain:${domain}`)

  return { success: true }
})
