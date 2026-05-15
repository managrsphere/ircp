<script setup lang="ts">
definePageMeta({
  colorMode: 'light'
})

const { data: page } = await useAsyncData('venue', () => queryCollection('venue').first())
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
      :title="page.venue.title"
      orientation="horizontal"
    >
      <template #description>
        <p>{{ page.venue.description }}</p>
        <div class="flex gap-2 items-center mt-4 font-medium">
          <UIcon name="i-lucide-map-pin" />
          <p>
            {{ page.venue.address }}
          </p>
        </div>
      </template>
      <div class="rounded-xl overflow-hidden border border-default w-full mt-6">
        <iframe
          width="100%"
          height="420"
          style="border:0"
          loading="lazy"
          title="marinaforum Regensburg - Lage und Umgebung"
          src="https://www.openstreetmap.org/export/embed.html?bbox=12.108%2C49.013%2C12.130%2C49.022&layer=mapnik&marker=49.0169%2C12.1187"
        />
      </div>
    </UPageSection>
  </div>
</template>
