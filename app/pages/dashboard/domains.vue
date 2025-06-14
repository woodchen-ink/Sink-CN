<script setup>
import { Plus } from 'lucide-vue-next'

const domains = ref([])
const loading = ref(false)

async function getDomains() {
  loading.value = true
  try {
    domains.value = await useAPI('/api/domain/list')
  }
  catch (error) {
    console.error('获取域名列表失败:', error)
  }
  finally {
    loading.value = false
  }
}

function updateDomain(domain, type) {
  if (type === 'delete') {
    domains.value = domains.value.filter(d => d.domain !== domain.domain)
  }
  else if (type === 'create') {
    domains.value.unshift(domain)
  }
  else if (type === 'edit') {
    const index = domains.value.findIndex(d => d.domain === domain.domain)
    if (index !== -1) {
      domains.value[index] = domain
    }
  }
}

onMounted(() => {
  getDomains()
})
</script>

<template>
  <main class="space-y-6">
    <DashboardBreadcrumb title="域名重定向" />

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          域名重定向管理
        </h1>
        <p class="text-muted-foreground">
          管理不同域名的重定向规则，当用户通过指定域名访问时自动跳转到目标URL
        </p>
      </div>

      <DashboardDomainsEditor @update:domain="updateDomain">
        <Button>
          <Plus class="w-4 h-4 mr-2" />
          添加域名重定向
        </Button>
      </DashboardDomainsEditor>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>

    <div v-else-if="domains.length === 0" class="text-center py-8">
      <p class="text-muted-foreground">
        暂无域名重定向规则
      </p>
    </div>

    <div v-else class="grid gap-4">
      <DashboardDomainsDomain
        v-for="domain in domains"
        :key="domain.id"
        :domain="domain"
        @update:domain="updateDomain"
      />
    </div>
  </main>
</template>
