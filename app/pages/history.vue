<script setup lang="ts">
definePageMeta({
  colorMode: 'light'
})

const { data: page } = await useAsyncData('history', () => queryCollection('history').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.seo.title,
  ogTitle: page.value.seo.title,
  description: page.value.seo.description,
  ogDescription: page.value.seo.description
})
</script>

<template>
  <div v-if="page">
    <UPageSection
      id="history"
      :title="page.history.title"
      :description="page.history.description"
    >
      <UTimeline
        :items="page.history.items"
        :ui="{ date: 'text-primary' }"
      />
    </UPageSection>
  </div>
</template>
