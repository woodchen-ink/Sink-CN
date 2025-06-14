<script setup>
import { DomainRedirectSchema } from '@@/schemas/domain'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

const props = defineProps({
  domain: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:domain'])

const domain = ref(props.domain)
const dialogOpen = ref(false)

const isEdit = !!props.domain.id

const EditDomainSchema = DomainRedirectSchema.pick({
  domain: true,
  redirectUrl: true,
}).extend({
  optional: DomainRedirectSchema.omit({
    id: true,
    domain: true,
    redirectUrl: true,
    createdAt: true,
    updatedAt: true,
  }).optional(),
})

const fieldConfig = {
  domain: {
    disabled: isEdit,
    description: '请输入要重定向的域名，如：example.com',
  },
  redirectUrl: {
    description: '当用户访问该域名时要跳转到的目标URL',
  },
  optional: {
    comment: {
      component: 'textarea',
      description: '可选的备注信息',
    },
    enabled: {
      component: 'switch',
      description: '是否启用此重定向规则',
    },
    fullPathRedirect: {
      component: 'switch',
      description: '是否进行全路径重定向（如：a.com/1.png → target.com/1.png）',
    },
  },
}

const form = useForm({
  validationSchema: toTypedSchema(EditDomainSchema),
  initialValues: {
    domain: domain.value.domain || '',
    redirectUrl: domain.value.redirectUrl || '',
    optional: {
      comment: domain.value.comment || '',
      enabled: domain.value.enabled !== undefined ? domain.value.enabled : true,
      fullPathRedirect: domain.value.fullPathRedirect !== undefined ? domain.value.fullPathRedirect : true,
    },
  },
  validateOnMount: isEdit,
  keepValuesOnUnmount: isEdit,
})

async function onSubmit(values) {
  try {
    const payload = {
      domain: values.domain,
      redirectUrl: values.redirectUrl,
      comment: values.optional?.comment || '',
      enabled: values.optional?.enabled !== undefined ? values.optional.enabled : true,
      fullPathRedirect: values.optional?.fullPathRedirect !== undefined ? values.optional.fullPathRedirect : true,
    }

    let result
    if (isEdit) {
      result = await useAPI('/api/domain/edit', {
        method: 'PUT',
        body: payload,
      })
      emit('update:domain', result.domainRedirect, 'edit')
      toast('域名重定向规则更新成功')
    }
    else {
      result = await useAPI('/api/domain/create', {
        method: 'POST',
        body: payload,
      })
      emit('update:domain', result.domainRedirect, 'create')
      toast('域名重定向规则创建成功')
    }

    dialogOpen.value = false
  }
  catch (error) {
    console.error('保存失败:', error)
    if (error.statusCode === 409) {
      toast('该域名重定向规则已存在')
    }
    else {
      toast('保存失败，请重试')
    }
  }
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <slot>
        <Button class="ml-2" variant="outline">
          {{ isEdit ? '编辑' : '添加域名重定向' }}
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>{{ isEdit ? '编辑域名重定向' : '添加域名重定向' }}</DialogTitle>
        <DialogDescription>
          {{ isEdit ? '修改域名重定向规则' : '创建新的域名重定向规则，当用户通过指定域名访问时自动跳转到目标URL' }}
        </DialogDescription>
      </DialogHeader>

      <AutoForm
        class="overflow-y-auto px-2 space-y-4"
        :schema="EditDomainSchema"
        :form="form"
        :field-config="fieldConfig"
        @submit="onSubmit"
      >
        <DialogFooter>
          <DialogClose as-child>
            <Button
              type="button"
              variant="secondary"
              class="mt-2 sm:mt-0"
            >
              取消
            </Button>
          </DialogClose>
          <Button type="submit">
            {{ isEdit ? '更新' : '创建' }}
          </Button>
        </DialogFooter>
      </AutoForm>
    </DialogContent>
  </Dialog>
</template>
