<script setup lang="ts">
definePageMeta({
  colorMode: 'dark'
})

const { data: page } = await useAsyncData('index', () => queryCollection('content').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const heroTitle = computed(() => {
  const [primary = '', ...secondaryParts] = (page.value?.title ?? '').split('\n')

  return {
    primary,
    secondary: secondaryParts.join(' ').trim()
  }
})

function enterMotion(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay }
  }
}

function scrollMotion(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    inViewOptions: { once: true, amount: 0.3 },
    transition: { duration: 0.6, delay }
  }
}

function scrollMotionLarge(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    inViewOptions: { once: true, amount: 0.15 },
    transition: { duration: 0.6, delay }
  }
}

function staggerMotion(index: number = 0) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    inViewOptions: { once: true, amount: 0.3 },
    transition: { duration: 0.6, delay: index * 0.08 }
  }
}
</script>

<template>
  <div v-if="page">
    <!-- Hero -->
    <UPageHero
      :ui="{
        root: 'pb-24 sm:pb-32',
        container: 'relative z-10 lg:py-32',
        wrapper: 'flex flex-col items-center',
        title: 'sm:text-6xl lg:text-7xl xl:text-[80px] tracking-tighter leading-[1.05]',
        description: 'mt-5 max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-default',
        links: 'gap-3'
      }"
    >
      <template #top>
        <Motion v-bind="staggerMotion(0)">
          <HeroShaders class="absolute top-0 inset-x-0 opacity-15 h-full" />
        </Motion>

        <GradientGlow class="top-0 w-2/3 h-1/2" />
      </template>

      <template #headline>
        <Motion v-bind="enterMotion(0.2)">
          <UBadge
            color="neutral"
            variant="soft"
            :label="page.hero.headline"
            class="rounded-full px-3 py-1.5 gap-1.5 bg-white/5 backdrop-blur"
          >
            <template #leading>
              <UChip
                inset
                standalone
                :ui="{ base: 'animate-pulse ring-0' }"
              />
            </template>
          </UBadge>
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="enterMotion(0.35)"
          class="inline-block"
        >
          {{ heroTitle.primary }}
          <br v-if="heroTitle.secondary">
          <span
            v-if="heroTitle.secondary"
            class="animate-shimmer bg-size-[200%_auto] bg-clip-text text-transparent"
            :style="{
              backgroundImage: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-300), var(--color-primary-200), var(--color-primary-100), var(--color-primary-200), var(--color-primary-300), var(--color-primary-400))',
              animationDuration: '10s'
            }"
          >
            {{ heroTitle.secondary }}
          </span>
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="enterMotion(0.5)"
          class="inline-block"
        >
          {{ page.description }}
        </Motion>
      </template>

      <template #links>
        <Motion
          class="flex flex-wrap justify-center gap-6"
          v-bind="enterMotion(0.65)"
        >
          <UButton
            v-for="link in page.hero.links"
            :key="link.label"
            v-bind="link"
          />
        </Motion>
      </template>
    </UPageHero>

    <!-- Overview -->
    <UPageSection
      id="overview"
      orientation="horizontal"
      :reverse="true"
      :ui="{
        root: 'py-24 sm:py-32 scroll-mt-(--ui-header-height) bg-neutral-900',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-2xl mx-auto',
        description: 'max-w-xl mx-auto'
      }"
    >
      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.overview.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.overview.description }}
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.3)"
      >
        <img
          src="/images/overview.jpg"
          alt="Country flags"
          class="w-full rounded-lg"
          loading="lazy"
        >
      </Motion>
    </UPageSection>

    <!-- History -->
    <UPageSection
      id="history"
      orientation="horizontal"
      :ui="{
        root: 'py-24 sm:py-32 scroll-mt-(--ui-header-height)',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-2xl mx-auto',
        description: 'max-w-xl mx-auto'
      }"
    >
      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.history.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.history.description }}
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.3)"
      >
        <UTimeline
          :items="page.history.items"
          :ui="{ date: 'text-primary' }"
        />
      </Motion>
    </UPageSection>

    <!-- Mission & Vision -->
    <UPageSection
      id="mission"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height) bg-neutral-900',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-md mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.mission.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.mission.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.mission.description }}
        </Motion>
      </template>

      <div class="rounded-2xl border border-default bg-default overflow-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
          <Motion
            v-for="(feature, index) in page.mission.items"
            :key="feature.title"
            v-bind="staggerMotion(index)"
          >
            <UPageCard
              :icon="feature.icon"
              :title="feature.title"
              :description="feature.description"
              variant="subtle"
              class="rounded-none duration-300"
              :ui="{
                leading: 'mb-5 flex size-9 justify-center rounded-lg bg-primary/10',
                title: 'text-sm tracking-tight',
                description: 'text-sm leading-relaxed sm:line-clamp-3 lg:line-clamp-5 text-dimmed'
              }"
            />
          </Motion>
        </div>
      </div>
    </UPageSection>

    <!-- 2026 -->
    <UPageSection
      id="ircp2026"
      orientation="horizontal"
      :ui="{
        root: 'py-24 sm:py-32 scroll-mt-(--ui-header-height)',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-2xl mx-auto',
        description: 'max-w-xl mx-auto'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          <ULink
            to="https://events.prehos.net/IRCP2026#/buyTickets/selectTickets?lang=en"
            target="_blank"
            class="text-primary underline underline-offset-4 decoration-primary/50"
          >
            {{ page.ircp2026.headline }}
          </ULink>
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.ircp2026.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.ircp2026.description }}
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.3)"
      >
        <img
          src="/images/ircp2026.jpg"
          alt="REF in front of Marinaforum Regensburg"
          class="w-full rounded-lg"
          loading="lazy"
        >
      </Motion>
    </UPageSection>

    <!-- Program -->
    <UPageSection
      id="program"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height) bg-neutral-900',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-md mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.program.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.program.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.program.description }}
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.3)"
        class="w-full"
      >
        <UCarousel
          v-slot="{ item }"
          loop
          arrows
          :autoplay="{ delay: 2000 }"
          wheel-gestures
          :prev="{ variant: 'solid' }"
          :next="{ variant: 'solid' }"
          :items="page.program.items"
          :ui="{ item: 'basis-1/3' }"
          class="max-w-5xl"
        >
          <UPageCard
            variant="subtle"
            :icon="item.icon"
            :title="item.title"
          />
        </UCarousel>
      </Motion>
    </UPageSection>

    <!-- Call for Speakers -->
    <UPageSection
      id="speakers"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height)',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-md mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.callForSpeakers.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.callForSpeakers.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.callForSpeakers.description }}
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotion(0.3)"
        class="w-full"
      >
        <UCard
          :title="page.callForSpeakers.callout.title"
          :description="page.callForSpeakers.callout.description"
          variant="soft"
          class="mb-6"
        />
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.2)"
        class="w-full"
      >
        <UPageGrid class="lg:grid-cols-2">
          <UPageFeature
            v-for="feature in page.callForSpeakers.features"
            :key="feature.title"
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
          />
        </UPageGrid>
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotion(0.2)"
        class="w-full"
      >
        <UAlert
          :icon="page.callForSpeakers.alert.icon"
          :title="page.callForSpeakers.alert.title"
          :description="page.callForSpeakers.alert.description"
          :actions="page.callForSpeakers.alert.actions"
          color="info"
          variant="soft"
          orientation="horizontal"
          class="mt-6"
        />
      </Motion>
    </UPageSection>

    <!-- Tickets -->
    <UPageSection
      id="tickets"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height) bg-neutral-900',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-md mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.tickets.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.tickets.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.tickets.description }}
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotion(0.3)"
        class="w-full"
      >
        <UCard
          :title="page.tickets.callout.title"
          :description="page.tickets.callout.description"
          variant="subtle"
          class="mb-6 border-2 border-warning"
        />
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.2)"
        class="w-full"
      >
        <UPricingPlans :plans="page.tickets.pricing" />
      </Motion>
    </UPageSection>

    <!-- Travel -->
    <UPageSection
      id="travel"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height)',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-md mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.travel.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.travel.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.travel.description }}
        </Motion>
      </template>

      <!-- Arrival -->
      <Motion
        as="div"
        v-bind="scrollMotion(0.3)"
        class="w-full mb-10"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UPageCard
            icon="i-lucide-train-front"
            :title="page.travel.arrival.train.title"
            :description="page.travel.arrival.train.description"
            variant="subtle"
            :ui="{
              title: 'text-sm tracking-tight',
              description: 'text-sm leading-relaxed text-dimmed'
            }"
          />
          <UPageCard
            icon="i-lucide-plane"
            :title="page.travel.arrival.plane.title"
            variant="subtle"
            :ui="{
              title: 'text-sm tracking-tight',
              description: 'text-sm leading-relaxed text-dimmed'
            }"
          >
            <template #description>
              <p class="text-sm text-dimmed mb-3">
                {{ page.travel.arrival.plane.description }}
              </p>
              <ul class="space-y-1.5">
                <li
                  v-for="airport in page.travel.arrival.plane.airports"
                  :key="airport.name"
                  class="flex items-center gap-2 text-sm"
                >
                  <UIcon
                    name="i-lucide-map-pin"
                    class="text-primary size-4 shrink-0"
                  />
                  <span class="font-medium">{{ airport.name }}</span>
                  <span class="text-dimmed">– {{ airport.distance }}</span>
                </li>
              </ul>
            </template>
          </UPageCard>
        </div>
      </Motion>

      <!-- Venue -->
      <Motion
        as="div"
        v-bind="scrollMotion(0.2)"
        class="w-full mb-4"
      >
        <p class="font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] mb-6">
          Veranstaltungsort
        </p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-6">
          <div class="space-y-3">
            <h3 class="text-lg font-semibold tracking-tight">
              {{ page.travel.venue.title }}
            </h3>
            <p class="text-sm leading-relaxed text-dimmed">
              {{ page.travel.venue.description }}
            </p>
          </div>
          <img
            :src="page.travel.venue.image"
            alt="marinaforum Regensburg"
            class="w-full rounded-lg object-cover aspect-video"
            loading="lazy"
          >
        </div>
      </Motion>

      <!-- Map -->
      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.2)"
        class="w-full mb-10"
      >
        <div class="rounded-xl overflow-hidden border border-default">
          <iframe
            width="100%"
            height="420"
            style="border:0"
            loading="lazy"
            title="marinaforum Regensburg – Lage & Umgebung"
            src="https://www.openstreetmap.org/export/embed.html?bbox=12.108%2C49.013%2C12.130%2C49.022&layer=mapnik&marker=49.0169%2C12.1187"
          />
        </div>
        <div class="mt-2 text-right">
          <ULink
            to="https://www.openstreetmap.org/?mlat=49.0169&mlon=12.1187#map=16/49.0169/12.1187"
            target="_blank"
            class="text-xs text-dimmed hover:text-default transition-colors"
          >
            Größere Karte anzeigen →
          </ULink>
        </div>
      </Motion>

      <!-- Hotels & Parking -->
      <Motion
        as="div"
        v-bind="scrollMotion(0.2)"
        class="w-full mb-10"
      >
        <p class="font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] mb-6">
          Hotels & Parken
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <UPageCard
            icon="i-lucide-hotel"
            title="Hampton by Hilton"
            description="Direkt neben dem marinaforum – ideal für Kongressteilnehmende"
            variant="subtle"
            to="https://www.hilton.com/en/hotels/mucsrhx-hampton-regensburg/"
            target="_blank"
            :ui="{ title: 'text-sm tracking-tight', description: 'text-xs text-dimmed' }"
          />
          <UPageCard
            icon="i-lucide-hotel"
            title="Hotel Dock1"
            description="Modernes Hotel, ca. 10 Min. zu Fuß zum Veranstaltungsort"
            variant="subtle"
            to="http://www.hotel-dock1.de/"
            target="_blank"
            :ui="{ title: 'text-sm tracking-tight', description: 'text-xs text-dimmed' }"
          />
          <UPageCard
            icon="i-lucide-hotel"
            title="Kneitinger Alter Schlachthof"
            description="Hotel mit Tradition, fußläufig zum marinaforum erreichbar"
            variant="subtle"
            to="http://www.hotel-schlachthof-regensburg.de/"
            target="_blank"
            :ui="{ title: 'text-sm tracking-tight', description: 'text-xs text-dimmed' }"
          />
        </div>
        <UAlert
          icon="i-lucide-square-parking"
          title="Parkhaus Marinaquartier"
          description="Das Parkhaus Marinaquartier (Von-Donle-Straße 5) befindet sich direkt beim Veranstaltungsort und ist 24 Stunden geöffnet. Hinweis: Kartenzahlung am Automaten aktuell nicht zuverlässig verfügbar – Barzahlung empfohlen."
          color="info"
          variant="soft"
        />
      </Motion>

      <!-- Regensburg -->
      <Motion
        as="div"
        v-bind="scrollMotion(0.2)"
        class="w-full mb-6"
      >
        <div class="text-center space-y-2 mb-6">
          <p class="font-mono font-medium text-xs text-primary uppercase tracking-[0.12em]">
            Die Gastgeberstadt
          </p>
          <h3 class="text-xl font-semibold tracking-tight">
            {{ page.travel.regensburg.title }}
          </h3>
          <p class="text-sm leading-relaxed text-dimmed max-w-xl mx-auto">
            {{ page.travel.regensburg.description }}
          </p>
        </div>
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.2)"
        class="w-full"
      >
        <UCarousel
          v-slot="{ item }"
          loop
          arrows
          :autoplay="{ delay: 3000 }"
          wheel-gestures
          :prev="{ variant: 'solid' }"
          :next="{ variant: 'solid' }"
          :items="page.travel.regensburg.images"
          :ui="{ item: 'basis-full sm:basis-1/2 lg:basis-1/3' }"
        >
          <img
            :src="item.src"
            :alt="item.alt"
            class="w-full rounded-lg object-cover aspect-video"
            loading="lazy"
          >
        </UCarousel>
      </Motion>
    </UPageSection>

    <!-- FAQ -->
    <UPageSection
      id="faq"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height) bg-neutral-900',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center"
        >
          {{ page.faq.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.faq.title }}
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.2)"
        class="w-full"
      >
        <UCard variant="outline">
          <UAccordion :items="page.faq.items" />
        </UCard>
      </Motion>
    </UPageSection>

    <!-- Contact -->
    <UPageSection
      id="contact"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height)',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-md mx-auto text-dimmed'
      }"
    >
      <template #top>
        <GradientGlow class="bottom-0 w-2/3 h-1/2" />
      </template>

      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.contact.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.contact.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.contact.description }}
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotion(0.3)"
        class="w-full"
      >
        <UPageGrid>
          <UUser
            v-for="(user, index) in page.contact.team"
            :key="index"
            v-bind="user"
            :name="user.name"
            :description="user.role"
            orientation="vertical"
            :avatar="{
              src: user.img,
              loading: 'lazy',
              icon: 'i-lucide-image',
              class: 'size-24'
            }"
            :ui="{ root: 'items-center', wrapper: 'items-center' }"
          />
        </UPageGrid>
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotion(0.2)"
        class="w-full"
      >
        <UPageCard
          :title="page.contact.info.title"
          :description="page.contact.info.mail"
          icon="i-lucide-mail"
          :to="`mailto:${page.contact.info.mail}`"
          class="mt-6"
        />
      </Motion>
    </UPageSection>
  </div>
</template>
