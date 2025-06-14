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
    <div class="flex flex-col gap-6 sm:gap-2 sm:flex-row sm:justify-between">
      <DashboardNav class="flex-1">
        <DashboardDomainsEditor @update:domain="updateDomain">
          <Button>
            <Plus class="w-4 h-4 mr-2" />
            添加域名重定向
          </Button>
        </DashboardDomainsEditor>
      </DashboardNav>
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
