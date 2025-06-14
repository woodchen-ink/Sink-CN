import type { LinkSchema } from '@@/schemas/link'
import type { z } from 'zod'
import { joinURL, parsePath, withQuery } from 'ufo'

export default eventHandler(async (event) => {
  const { pathname: slug } = parsePath(event.path.replace(/^\/|\/$/g, '')) // remove leading and trailing slashes
  const { slugRegex, reserveSlug } = useAppConfig(event)
  const { homeURL, linkCacheTtl, redirectWithQuery, caseSensitive } = useRuntimeConfig(event)
  const { cloudflare } = event.context

  // 获取请求的域名
  const host = getRequestHost(event)

  // 检查域名重定向规则（优先级最高）
  if (cloudflare) {
    const { KV } = cloudflare.env
    const domainRedirect = await KV.get(`domain:${host}`, { type: 'json' })

    if (domainRedirect && domainRedirect.enabled) {
      // 根据fullPathRedirect设置决定重定向方式
      let targetUrl
      if (domainRedirect.fullPathRedirect) {
        // 全路径重定向：将当前路径附加到重定向URL后面
        targetUrl = joinURL(domainRedirect.redirectUrl, event.path)
        console.log(`Full path domain redirect: ${host}${event.path} -> ${targetUrl}`)
      }
      else {
        // 仅根路径重定向
        if (event.path === '/') {
          targetUrl = domainRedirect.redirectUrl
          console.log(`Root path domain redirect: ${host} -> ${targetUrl}`)
        }
        else {
          // 非根路径不重定向，继续处理后续逻辑
          targetUrl = null
        }
      }

      if (targetUrl) {
        return sendRedirect(event, targetUrl, +useRuntimeConfig(event).redirectStatusCode)
      }
    }
  }

  if (event.path === '/' && homeURL)
    return sendRedirect(event, homeURL)

  if (slug && !reserveSlug.includes(slug) && slugRegex.test(slug) && cloudflare) {
    const { KV } = cloudflare.env

    let link: z.infer<typeof LinkSchema> | null = null

    const getLink = async (key: string) =>
      await KV.get(`link:${key}`, { type: 'json', cacheTtl: linkCacheTtl })

    const lowerCaseSlug = slug.toLowerCase()
    link = await getLink(caseSensitive ? slug : lowerCaseSlug)

    // fallback to original slug if caseSensitive is false and the slug is not found
    if (!caseSensitive && !link && lowerCaseSlug !== slug) {
      console.log('original slug fallback:', `slug:${slug} lowerCaseSlug:${lowerCaseSlug}`)
      link = await getLink(slug)
    }

    if (link) {
      event.context.link = link
      try {
        await useAccessLog(event)
      }
      catch (error) {
        console.error('Failed write access log:', error)
      }
      const target = redirectWithQuery ? withQuery(link.url, getQuery(event)) : link.url
      return sendRedirect(event, target, +useRuntimeConfig(event).redirectStatusCode)
    }
  }
})
