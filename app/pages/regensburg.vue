<script setup lang="ts">
definePageMeta({
  colorMode: 'light'
})

const { data: page } = await useAsyncData('regensburg', () => queryCollection('regensburg').first())
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
      :title="page.regensburg.title"
      :description="page.regensburg.description"
      orientation="horizontal"
    >
      <img
        :src="publicAsset('regensburg-1.jpg')"
        alt="Regensburg"
        class="w-full rounded-lg object-cover aspect-video"
        loading="lazy"
      >
    </UPageSection>
  </div>
</template>
