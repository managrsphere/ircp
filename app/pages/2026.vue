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
      <iframe
        v-if="showInstagram"
        src="https://cdn.lightwidget.com/widgets/de75947bf2215f939a48c3d90cfd55c9.html"
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

    <UPageSection
      :title="page.recent.title"
      :description="page.recent.description"
      orientation="vertical"
    >
      <!-- Videos -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div
          v-for="video in page.recent.videos"
          :key="video.src"
          class="space-y-3"
        >
          <video
            :src="video.src"
            controls
            playsinline
            preload="metadata"
            class="w-full aspect-9/16 object-cover rounded-lg"
          />

          <h3 class="text-lg font-semibold">
            {{ video.title }}
          </h3>
        </div>
      </div>

      <!-- Carousel -->
      <div class="w-full flex flex-col justify-center items-center my-8">
        <h3 class="text-2xl font-semibold text-center mb-4">
          {{ page.recent.carousel_title }}
        </h3>

        <UCarousel
          v-slot="{ item }"
          loop
          arrows
          :autoplay="{ delay: 2000 }"
          wheel-gestures
          :prev="{ variant: 'solid' }"
          :next="{ variant: 'solid' }"
          :items="page.recent.img_carousel"
          :ui="{
            item: 'basis-1/3 ps-0',
            prev: 'sm:start-8',
            next: 'sm:end-8',
            container: 'ms-0'
          }"
          class="max-w-5xl"
        >
          <img
            :src="item.img"
            :alt="item.alt"
            class="w-full h-64 object-cover rounded-lg"
          >
        </UCarousel>
      </div>
    </UPageSection>
  </div>
</template>
