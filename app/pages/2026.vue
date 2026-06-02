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
// Load LightWidget script in head so client templates don't contain side-effect tags
useHead({
  script: [
    { src: 'https://cdn.lightwidget.com/widgets/lightwidget.js', defer: true }
  ]
})

const { cookiesEnabledIds } = useCookieControl()

const showInstagram = computed(() =>
  cookiesEnabledIds.value?.includes('external_media')
)
</script>

<template>
  <div v-if="page">
    <UPageSection
      :title="page.ircp2026.title"
      :description="page.ircp2026.description"
      :headline="page.ircp2026.headline"
      orientation="horizontal"
    >
      <!-- LightWidget WIDGET -->
      <iframe
        v-if="showInstagram"
        src="//lightwidget.com/widgets/de75947bf2215f939a48c3d90cfd55c9.html"
        scrolling="no"
        allowtransparency="true"
        class="lightwidget-widget"
        style="width:100%;border:0;overflow:hidden;"
      />
      <div
        v-else
        class="p-6 text-sm opacity-70"
      >
        Instagram-Inhalte werden erst nach Zustimmung zu externen Medien geladen.
      </div>
    </UPageSection>
  </div>
</template>
