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
      title="Tagestickets ab jetzt verfügbar!"
      :actions="[
        {
          label: 'Jetzt kaufen',
          variant: 'soft',
          to: 'https://buy.stripe.com/dRm00k4gv4qL2vceM99R606',
          target: '_blank',
          trailingIcon: 'i-lucide-external-link'
        },
        {
          label: 'Student:innen',
          variant: 'soft',
          to: 'https://buy.stripe.com/7sYbJ27sHbTd1r8bzX9R607',
          target: '_blank',
          trailingIcon: 'i-lucide-external-link'
        }]"
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
