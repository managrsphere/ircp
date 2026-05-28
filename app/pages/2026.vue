<script setup lang="ts">
definePageMeta({
  colorMode: 'light'
})

const { data: page } = await useAsyncData('year', () => queryCollection('year').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.seo.title,
  ogTitle: page.value.seo.title,
  description: page.value.seo.description,
  ogDescription: page.value.seo.description
})

const { data: response } = await useFetch('https://graph.facebook.com/v25.0/instagram_oembed?url=https://www.instagram.com/ircp.regensburg2026/')
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
        :src="'/2026.jpg'"
        alt="Landing"
        class="rounded-lg shadow-lg"
      >
      <div>{{ response }}</div>
    </UPageSection>
  </div>
</template>
