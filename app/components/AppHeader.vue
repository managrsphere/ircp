<script setup lang="ts">
import { motion } from 'motion-v'
import type { VariantType } from 'motion-v'

const nuxtApp = useNuxtApp()
const activeSection = ref<string>()

const items = computed(() => [
  {
    label: 'IRCP',
    children: [
      {
        label: 'Überblick',
        to: '/general'
      },
      {
        label: 'Geschichte',
        to: '/history'
      },
      {
        label: 'IRCP 2026',
        to: '/2026'
      }
    ]
  },
  {
    label: 'Programm',
    to: '#program',
    exactHash: true,
    active: activeSection.value === 'program'
  },
  {
    label: 'Call for Speakers',
    to: '#speakers',
    exactHash: true,
    active: activeSection.value === 'speakers'
  },
  {
    label: 'Tickets',
    to: '#tickets',
    exactHash: true,
    active: activeSection.value === 'tickets'
  },
  {
    label: 'Anreise & Aufenthalt',
    children: [
      {
        label: 'Anreise & Unterkunft',
        to: '/travel-stay'
      },
      {
        label: 'Veranstaltungsort',
        to: '/venue'
      },
      {
        label: 'Regensburg',
        to: '/regensburg'
      }
    ]
  },
  {
    label: 'FAQ',
    to: '#faq',
    exactHash: true,
    active: activeSection.value === 'faq'
  }
])

nuxtApp.hooks.hookOnce('page:loading:end', () => {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.find(e => e.isIntersecting)
    if (visible) {
      activeSection.value = visible.target.id
    } else if (entries.every(e => !e.isIntersecting)) {
      activeSection.value = undefined
    }
  }, { rootMargin: '-50% 0px -50% 0px' })

  document.querySelectorAll('#program, #speakers, #tickets, #faq').forEach(el => observer.observe(el))
})

const variants: Record<string, VariantType | ((custom: unknown) => VariantType)> = {
  normal: {
    rotate: 0,
    y: 0,
    opacity: 1
  },
  close: (custom: unknown) => {
    const c = custom as number
    return {
      rotate: c === 1 ? 45 : c === 3 ? -45 : 0,
      y: c === 1 ? 6 : c === 3 ? -6 : 0,
      opacity: c === 2 ? 0 : 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  }
}
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="h-6 w-auto shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="items"
    />

    <template #right>
      <UButton
        label="Tickets"
        class="hidden lg:flex"
        to="https://events.prehos.net/IRCP2026#/buyTickets/selectTickets?lang=en"
        target="_blank"
      />
    </template>

    <template #toggle="{ open, toggle, ui }">
      <UButton
        size="sm"
        variant="ghost"
        color="neutral"
        square
        :aria-label="open ? 'Close navigation' : 'Open navigation'"
        :aria-expanded="open"
        :class="ui.toggle({ toggleSide: 'right' })"
        @click="toggle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <motion.line
            x1="4"
            y1="6"
            x2="20"
            y2="6"
            :variants="variants"
            :animate="open ? 'close' : 'normal'"
            :custom="1"
            class="outline-none"
          />
          <motion.line
            x1="4"
            y1="12"
            x2="20"
            y2="12"
            :variants="variants"
            :animate="open ? 'close' : 'normal'"
            :custom="2"
            class="outline-none"
          />
          <motion.line
            x1="4"
            y1="18"
            x2="20"
            y2="18"
            :variants="variants"
            :animate="open ? 'close' : 'normal'"
            :custom="3"
            class="outline-none"
          />
        </svg>
      </UButton>
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
      />

      <div class="mt-4 flex flex-col gap-2">
        <UButton
          label="Tickets"
          block
          to="https://events.prehos.net/IRCP2026#/buyTickets/selectTickets?lang=en"
          target="_blank"
        />
      </div>
    </template>
  </UHeader>
</template>
