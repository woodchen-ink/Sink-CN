<script setup>
import { useClipboard } from '@vueuse/core'
import { ArrowRight, Copy, CopyCheck, ExternalLink, Globe, Route, SquarePen, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps({
  domain: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:domain'])

const domainUrl = computed(() => `https://${props.domain.domain}`)
const { copy, copied } = useClipboard({ source: domainUrl.value, copiedDuring: 400 })

function updateDomain(domain, type) {
  emit('update:domain', domain, type)
}

function copyDomain() {
  copy(domainUrl.value)
  toast('域名已复制到剪贴板')
}

async function deleteDomain() {
  // eslint-disable-next-line no-alert
  const confirmed = window.confirm('确定要删除这个域名重定向规则吗？')
  if (!confirmed) {
    return
  }

  try {
    await useAPI('/api/domain/delete', {
      method: 'POST',
      body: { domain: props.domain.domain },
    })
    updateDomain(props.domain, 'delete')
    toast('域名重定向规则删除成功')
  }
  catch (error) {
    console.error('删除失败:', error)
    toast('删除失败，请重试')
  }
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleString('zh-CN')
}
</script>

<template>
  <Card>
    <div class="p-4 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Globe class="w-5 h-5 text-primary" />
          </div>

          <div class="flex-1 overflow-hidden">
            <div class="flex items-center space-x-2">
              <div class="font-bold text-lg">
                {{ domain.domain }}
              </div>

              <Badge :variant="domain.enabled ? 'default' : 'secondary'">
                {{ domain.enabled ? '启用' : '禁用' }}
              </Badge>

              <Badge
                v-if="domain.fullPathRedirect !== undefined"
                :variant="domain.fullPathRedirect ? 'outline' : 'secondary'"
                class="text-xs"
              >
                <Route class="w-3 h-3 mr-1" />
                {{ domain.fullPathRedirect ? '全路径' : '仅根路径' }}
              </Badge>

              <CopyCheck
                v-if="copied"
                class="w-4 h-4 cursor-pointer"
              />
              <Copy
                v-else
                class="w-4 h-4 cursor-pointer"
                @click="copyDomain"
              />
            </div>

            <div class="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
              <span>{{ domain.domain }}</span>
              <ArrowRight class="w-3 h-3" />
              <a
                :href="domain.redirectUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-primary flex items-center space-x-1"
              >
                <span class="truncate max-w-[200px]">{{ domain.redirectUrl }}</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </div>

            <div v-if="domain.fullPathRedirect" class="text-xs text-muted-foreground mt-1">
              示例：{{ domain.domain }}/1.png → {{ domain.redirectUrl }}/1.png
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <DashboardDomainsEditor
            :domain="domain"
            @update:domain="updateDomain"
          >
            <Button variant="ghost" size="sm">
              <SquarePen class="w-4 h-4" />
            </Button>
          </DashboardDomainsEditor>

          <Button
            variant="ghost"
            size="sm"
            @click="deleteDomain"
          >
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div v-if="domain.comment" class="text-sm text-muted-foreground">
        {{ domain.comment }}
      </div>

      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>创建时间: {{ formatDate(domain.createdAt) }}</span>
        <span v-if="domain.updatedAt !== domain.createdAt">
          更新时间: {{ formatDate(domain.updatedAt) }}
        </span>
      </div>
    </div>
  </Card>
</template>
