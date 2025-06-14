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

  // 添加调试日志
  console.log(`[Domain Redirect Debug] Host: ${host}, Path: ${event.path}, Slug: "${slug}"`)

  // 检查域名重定向规则（优先级最高，必须在所有其他逻辑之前）
  if (cloudflare) {
    const { KV } = cloudflare.env
    const domainKey = `domain:${host}`
    console.log(`[Domain Redirect Debug] Looking for key: ${domainKey}`)

    const domainRedirect = await KV.get(domainKey, { type: 'json' })
    console.log(`[Domain Redirect Debug] Found redirect rule:`, domainRedirect)

    if (domainRedirect && domainRedirect.enabled) {
      console.log(`[Domain Redirect Debug] Rule enabled: true, fullPathRedirect: ${domainRedirect.fullPathRedirect}`)

      // 根据fullPathRedirect设置决定重定向方式
      let targetUrl
      if (domainRedirect.fullPathRedirect) {
        // 全路径重定向：将当前路径附加到重定向URL后面
        targetUrl = joinURL(domainRedirect.redirectUrl, event.path)
        console.log(`[Domain Redirect] Full path domain redirect: ${host}${event.path} -> ${targetUrl}`)
      }
      else {
        // 仅根路径重定向
        console.log(`[Domain Redirect Debug] Checking root path redirect, event.path: "${event.path}"`)
        if (event.path === '/') {
          targetUrl = domainRedirect.redirectUrl
          console.log(`[Domain Redirect] Root path domain redirect: ${host} -> ${targetUrl}`)
        }
        else {
          // 非根路径不重定向，继续处理后续逻辑
          targetUrl = null
          console.log(`[Domain Redirect] Non-root path, skipping redirect for: ${event.path}`)
        }
      }

      if (targetUrl) {
        console.log(`[Domain Redirect] Executing redirect to: ${targetUrl}`)
        return sendRedirect(event, targetUrl, +useRuntimeConfig(event).redirectStatusCode)
      }
      else {
        console.log(`[Domain Redirect] No targetUrl generated, continuing to next logic`)
      }
    }
    else {
      console.log(`[Domain Redirect Debug] No valid redirect rule found for ${host} (rule exists: ${!!domainRedirect}, enabled: ${domainRedirect?.enabled})`)
    }
  }
  else {
    console.log(`[Domain Redirect Debug] No cloudflare context available`)
  }

  // 只有在没有域名重定向的情况下才检查 homeURL
  if (event.path === '/' && homeURL) {
    console.log(`[Home URL Redirect] Redirecting to homeURL: ${homeURL}`)
    return sendRedirect(event, homeURL)
  }

  // 短链接处理逻辑
  console.log(`[Short Link Debug] Checking slug: "${slug}", reserveSlug: ${reserveSlug}, slugRegex test: ${slugRegex.test(slug)}`)
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
      console.log(`[Short Link] Found link for slug: ${slug}, redirecting to: ${link.url}`)
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
    else {
      console.log(`[Short Link] No link found for slug: ${slug}`)
    }
  }

  console.log(`[Middleware] No redirect applied, continuing to normal page rendering for path: ${event.path}`)
})
