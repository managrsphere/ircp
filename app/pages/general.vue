<script setup lang="ts">
definePageMeta({
  colorMode: 'light'
})

const { data: page } = await useAsyncData('general', () => queryCollection('general').first())
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
      :title="page.overview.title"
      :description="page.overview.description"
      orientation="horizontal"
    >
      <template #description>
        <p>{{ page.overview.description }}</p>
        <UButton
          :icon="page.overview.button.icon"
          :label="page.overview.button.title"
          :to="page.overview.button.to"
          :target="page.overview.button.target"
          class="mt-4"
          variant="subtle"
        />
        <UButton
          :icon="page.overview.internationalButton.icon"
          :label="page.overview.internationalButton.title"
          :to="page.overview.internationalButton.to"
          :target="page.overview.internationalButton.target"
          class="mt-4 ml-4"
        />
      </template>
      <img
        :src="'/IRCP_Logo.png'"
        alt="IRCP Logo"
        class="rounded-lg"
      >
    </UPageSection>
  </div>
</template>
