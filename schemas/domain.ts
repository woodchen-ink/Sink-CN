import { customAlphabet } from 'nanoid'
import { z } from 'zod'

const nanoid = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 10)

export const DomainRedirectSchema = z.object({
  id: z.string().trim().max(26).default(nanoid),
  domain: z.string().trim().max(253).refine((domain) => {
    // 验证域名格式
    const domainRegex = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    return domainRegex.test(domain)
  }, {
    message: '请输入有效的域名格式',
  }),
  redirectUrl: z.string().trim().url().max(2048),
  comment: z.string().trim().max(2048).optional(),
  enabled: z.boolean().default(true),
  fullPathRedirect: z.boolean().default(true),
  createdAt: z.number().int().safe().default(() => Math.floor(Date.now() / 1000)),
  updatedAt: z.number().int().safe().default(() => Math.floor(Date.now() / 1000)),
})
