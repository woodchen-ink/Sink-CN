<script setup>
import { toast } from 'vue-sonner'

const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:link'])

async function deleteLink() {
  await useAPI('/api/link/delete', {
    method: 'POST',
    body: {
      slug: props.link.slug,
    },
  })
  emit('update:link', props.link, 'delete')
  toast('Delete successful!')
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]">
      <AlertDialogHeader>
        <AlertDialogTitle>您确定吗？</AlertDialogTitle>
        <AlertDialogDescription>
          此操作无法撤销。此操作将真的从服务器删除您的链接。
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction @click="deleteLink">
          继续
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

