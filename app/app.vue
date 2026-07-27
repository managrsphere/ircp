<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#09090b' : 'white')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'de'
  }
})

useSeoMeta({
  ogImage: '/IRCP_Logo.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp :toaster="{ expand: false }">
    <UBanner
      id="tickets"
      icon="i-lucide-tickets"
      title="Jetzt Tickets sichern - Alle Tickets beinhalten spannende Vorträge, Keynotes, Roundtables und Fachsessions, interaktive Workshopsm, offizielles Kongressmaterial und Programmunterlagen & Vollverpflegung an allen drei Tagen!"
      close
    />
    <AppHeader />

    <UMain>
      <NuxtPage />
    </UMain>

    <AppFooter />
  </UApp>
  <CookieControl locale="de" />
</template>
