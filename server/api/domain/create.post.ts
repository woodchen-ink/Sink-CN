import { DomainRedirectSchema } from '@@/schemas/domain'

defineRouteMeta({
  openAPI: {
    description: '创建新的域名重定向规则',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['domain', 'redirectUrl'],
            properties: {
              domain: {
                type: 'string',
                description: '域名',
              },
              redirectUrl: {
                type: 'string',
                description: '重定向目标URL',
              },
              comment: {
                type: 'string',
                description: '备注',
              },
              enabled: {
                type: 'boolean',
                description: '是否启用',
              },
              fullPathRedirect: {
                type: 'boolean',
                description: '是否进行全路径重定向',
              },
            },
          },
        },
      },
    },
  },
})

export default eventHandler(async (event) => {
  const domainRedirect = await readValidatedBody(event, DomainRedirectSchema.parse)

  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  // 检查域名是否已存在
  const existingDomain = await KV.get(`domain:${domainRedirect.domain}`)
  if (existingDomain) {
    throw createError({
      status: 409,
      statusText: '该域名重定向规则已存在',
    })
  }

  // 保存域名重定向规则
  await KV.put(`domain:${domainRedirect.domain}`, JSON.stringify(domainRedirect), {
    metadata: {
      domain: domainRedirect.domain,
      redirectUrl: domainRedirect.redirectUrl,
      comment: domainRedirect.comment,
      enabled: domainRedirect.enabled,
      fullPathRedirect: domainRedirect.fullPathRedirect,
    },
  })

  setResponseStatus(event, 201)
  return { domainRedirect }
})
