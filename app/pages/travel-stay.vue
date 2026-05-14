<script setup lang="ts">
definePageMeta({
  colorMode: 'light'
})

const { data: page } = await useAsyncData('travel-stay', () => queryCollection('travelStay').first())
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
    <UPageHero
      :headline="page.headline"
      :title="page.title"
      :description="page.description"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-train-front"
                class="size-5 text-primary"
              />
              <h3 class="font-semibold tracking-tight">
                {{ page.arrival.train.title }}
              </h3>
            </div>
          </template>
          <p class="text-sm leading-relaxed text-dimmed">
            {{ page.arrival.train.description }}
          </p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-plane"
                class="size-5 text-primary"
              />
              <h3 class="font-semibold tracking-tight">
                {{ page.arrival.plane.title }}
              </h3>
            </div>
          </template>
          <p class="text-sm leading-relaxed text-dimmed mb-4">
            {{ page.arrival.plane.description }}
          </p>
          <ul class="space-y-2 text-sm">
            <li
              v-for="airport in page.arrival.plane.airports"
              :key="airport.name"
              class="flex items-center gap-2"
            >
              <UIcon
                name="i-lucide-map-pin"
                class="size-4 text-primary"
              />
              <span class="font-medium">{{ airport.name }}</span>
              <span class="text-dimmed">- {{ airport.distance }}</span>
            </li>
          </ul>
        </UCard>
      </div>
    </UPageHero>

    <UPageSection>
      <template #title>
        <span>Hotels & Parken</span>
      </template>

      <template #description>
        <span>Ausgewählte Unterkünfte in direkter Nähe zum Veranstaltungsort.</span>
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-6">
        <UPageCard
          icon="i-lucide-hotel"
          title="Hampton by Hilton"
          description="Direkt neben dem marinaforum - ideal für Kongressteilnehmende"
          variant="subtle"
          to="https://www.hilton.com/en/hotels/mucsrhx-hampton-regensburg/"
          target="_blank"
        />
        <UPageCard
          icon="i-lucide-hotel"
          title="Hotel Dock1"
          description="Modernes Hotel, ca. 10 Minuten zu Fuß zum Veranstaltungsort"
          variant="subtle"
          to="http://www.hotel-dock1.de/"
          target="_blank"
        />
        <UPageCard
          icon="i-lucide-hotel"
          title="Kneitinger Alter Schlachthof"
          description="Hotel mit Tradition, fußläufig zum marinaforum erreichbar"
          variant="subtle"
          to="http://www.hotel-schlachthof-regensburg.de/"
          target="_blank"
        />
      </div>

      <UAlert
        icon="i-lucide-square-parking"
        title="Parkhaus Marinaquartier"
        description="Das Parkhaus Marinaquartier (Von-Donle-Straße 5) liegt direkt am Veranstaltungsort und ist 24 Stunden geöffnet. Hinweis: Kartenzahlung am Automaten aktuell nicht zuverlässig verfügbar - Barzahlung empfohlen."
        color="info"
        variant="soft"
      />
    </UPageSection>
  </div>
</template>
