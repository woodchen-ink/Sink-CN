export default defineAppConfig({
  title: 'Sink',
  description: '具有分析功能的简单/快速/安全的链接缩短器。',
  image: 'https://sink.cool/banner.png',
  previewTTL: 24 * 3600, // 24h
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
  ],
})
