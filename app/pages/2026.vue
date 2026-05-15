<script setup lang="ts">
definePageMeta({
  colorMode: 'light'
})

const { data: page } = await useAsyncData('year', () => queryCollection('year').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const publicAsset = usePublicAsset()

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
      :title="page.ircp2026.title"
      :description="page.ircp2026.description"
      :headline="page.ircp2026.headline"
      orientation="horizontal"
      :reverse="true"
    >
      <img
        :src="publicAsset('/2026.jpg')"
        alt="Landing"
        class="rounded-lg shadow-lg"
      >
    </UPageSection>
  </div>
</template>
