import { DomainRedirectSchema } from '@@/schemas/domain'

export default eventHandler(async (event) => {
  const { previewMode } = useRuntimeConfig(event).public
  if (previewMode) {
    throw createError({
      status: 403,
      statusText: '预览模式无法编辑域名重定向规则',
    })
  }

  const domainRedirect = await readValidatedBody(event, DomainRedirectSchema.parse)
  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  // 检查域名重定向规则是否存在
  const existingDomain = await KV.get(`domain:${domainRedirect.domain}`, { type: 'json' })
  if (!existingDomain) {
    throw createError({
      status: 404,
      statusText: '域名重定向规则不存在',
    })
  }

  // 更新域名重定向规则
  const updatedDomain = {
    ...existingDomain,
    ...domainRedirect,
    id: existingDomain.id, // 保持原有ID
    createdAt: existingDomain.createdAt, // 保持创建时间
    updatedAt: Math.floor(Date.now() / 1000), // 更新修改时间
  }

  await KV.put(`domain:${domainRedirect.domain}`, JSON.stringify(updatedDomain), {
    metadata: {
      domain: updatedDomain.domain,
      redirectUrl: updatedDomain.redirectUrl,
      comment: updatedDomain.comment,
      enabled: updatedDomain.enabled,
      fullPathRedirect: updatedDomain.fullPathRedirect,
    },
  })

  return { domainRedirect: updatedDomain }
})
