<script setup lang="ts">
definePageMeta({
  colorMode: 'light'
})

const { data: page } = await useAsyncData('index', () => queryCollection('landing').first())
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

const heroDescription = computed(() => {
  const [primary = '', ...secondaryParts] = (page.value?.description ?? '').split('\n')

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

const publicAsset = usePublicAsset()

const ircpCards = computed(() => [
  {
    id: 'general',
    title: 'Was ist der IRCP?',
    description: 'Der International Roundtable on Community Paramedicine (IRCP) ist ein globales Netzwerk und eine jährlich stattfindende Konferenz zur Weiterentwicklung präklinischer Versorgungskonzepte.',
    image: '/overview.jpg',
    alt: 'Teilnehmende beim Austausch zum IRCP',
    to: '/general'
  },
  {
    id: 'history',
    title: 'Geschichte des IRCP',
    description: 'Vom ersten Treffen in Nova Scotia bis zur ersten Ausgabe in Deutschland – eine Reise durch mehr als 20 Jahre Community Paramedicine.',
    image: '/history.jpg',
    alt: 'Historische Skizze von Regensburg',
    to: '/history'
  },
  {
    id: 'ircp2026',
    title: 'IRCP 2026',
    description: 'Mit dem IRCP 2026 in Regensburg wird der Kongress erstmals in Deutschland ausgerichtet – ein bedeutender Schritt für die Weiterentwicklung innovativer Versorgungsmodelle im deutschsprachigen Raum. Vernetzen Sie sich international, lernen Sie von globalen Best-Practice-Modellen und gestalten Sie die Zukunft des Rettungsdienstes aktiv mit.',
    image: '/ircp2026.jpg',
    alt: 'IRCP 2026 in Regensburg',
    to: '/2026'
  }
])

const travelCards = computed(() => [
  {
    title: 'Anreise & Unterkunft',
    description: 'Anreiseoptionen, Hotels und praktische Hinweise für Ihren Aufenthalt in Regensburg.',
    image: '/travel-stay.jpg',
    alt: 'Plane, train and hotel icons',
    to: '/travel-stay'
  },
  {
    title: 'Veranstaltungsort',
    description: 'Das marinaforum Regensburg: Lage, Anfahrt und Umgebung des Veranstaltungsortes.',
    image: '/marinaforum.jpg',
    alt: 'Marinaforum Regensburg',
    to: '/venue'
  },
  {
    title: 'Regensburg',
    description: 'Informationen zur Gastgeberstadt Regensburg, ihrer Geschichte, Kultur und Highlights für Ihren Besuch.',
    image: '/regensburg-2.jpg',
    alt: 'Donauufer in Regensburg',
    to: '/regensburg'
  }
])
</script>

<template>
  <div v-if="page">
    <!-- Hero -->
    <UPageHero
      orientation="horizontal"
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
        <GradientGlow class="top-0 w-2/3 h-1/2" />
      </template>

      <template #headline>
        <Motion v-bind="enterMotion(0.2)">
          <UBadge
            color="neutral"
            variant="subtle"
            :label="page.hero.headline"
            class="rounded-full px-3 py-1.5 gap-1.5 backdrop-blur"
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
              backgroundImage: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-400), var(--color-primary-300), var(--color-primary-200), var(--color-primary-300), var(--color-primary-400), var(--color-primary-500))',
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
          {{ heroDescription.primary }} <br> {{ heroDescription.secondary }}
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

      <Motion
        as="span"
        v-bind="enterMotion(0.75)"
      >
        <img
          :src="publicAsset('/marinaforum.jpg')"
          alt="REF in front of marinaforum Regensburg"
          class="w-full rounded-lg shadow-lg"
          loading="lazy"
        >
      </Motion>
    </UPageHero>

    <!-- IRCP -->
    <UPageSection
      id="overview"
      :ui="{
        root: 'scroll-mt-(--ui-header-height) bg-neutral-300',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-2xl mx-auto',
        description: 'max-w-xl mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          IRCP
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          Überblick, Geschichte und IRCP 2026 auf einen Blick
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.25)"
        class="w-full"
      >
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="card in ircpCards"
            :id="card.id"
            :key="card.id"
            :to="card.to"
            class="group block scroll-mt-(--ui-header-height)"
          >
            <UCard
              class="h-full overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
            >
              <img
                :src="publicAsset(card.image)"
                :alt="card.alt"
                class="w-full aspect-video rounded-md object-cover"
                loading="lazy"
              >
              <div class="pt-4 space-y-2">
                <h3 class="text-base font-semibold tracking-tight">
                  {{ card.title }}
                </h3>
                <p class="text-sm leading-relaxed text-dimmed line-clamp-5">
                  {{ card.description }}
                </p>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </Motion>
    </UPageSection>

    <!-- Program -->
    <UPageSection
      id="program"
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
        v-bind="scrollMotion(0.25)"
        class="w-full"
      >
        <UAlert
          :icon="page.program.alert.icon"
          :title="page.program.alert.title"
          :description="page.program.alert.description"
          color="info"
          variant="subtle"
        />
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.3)"
        class="w-full overflow-hidden"
      >
        <UCarousel
          v-slot="{ item }"
          loop
          :autoplay="{ delay: 3000 }"
          wheel-gestures
          :items="page.program.items"
          :ui="{ container: 'items-stretch', item: 'xl:basis-1/3' }"
        >
          <UPageCard
            class="bg-neutral-300"
            :icon="item.icon"
            :title="item.title"
            :ui="{ root: 'h-full' }"
          />
        </UCarousel>
      </Motion>
    </UPageSection>

    <!-- Call for Speakers -->
    <UPageSection
      id="speakers"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height) bg-neutral-300',
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

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.2)"
        class="w-full"
      >
        <UPageGrid class="lg:grid-cols-2">
          <UPageCard
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
          variant="subtle"
          orientation="horizontal"
          class="mt-6"
        />
      </Motion>
    </UPageSection>

    <!-- Tickets -->
    <UPageSection
      id="tickets"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height) ',
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
        <UAlert
          :title="page.tickets.callout.title"
          :description="page.tickets.callout.description"
          color="warning"
          variant="subtle"
          class="mb-6"
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
        root: 'scroll-mt-(--ui-header-height) bg-neutral-300',
        container: 'max-w-5xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-xl mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          Gemeinsam vor Ort
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          Informationen für Teilnehmende
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.25)"
        class="w-full"
      >
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="card in travelCards"
            :key="card.title"
            :to="card.to"
            class="group block"
          >
            <UCard
              class="h-full overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
            >
              <img
                :src="publicAsset(card.image)"
                :alt="card.alt"
                class="w-full aspect-video rounded-md object-cover"
                loading="lazy"
              >
              <div class="pt-4 space-y-2">
                <h3 class="text-base font-semibold tracking-tight">
                  {{ card.title }}
                </h3>
                <p class="text-sm leading-relaxed text-dimmed line-clamp-5">
                  {{ card.description }}
                </p>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </Motion>
    </UPageSection>

    <!-- FAQ -->
    <UPageSection
      id="faq"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height) ',
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
        <UCard class="bg-neutral-300">
          <UAccordion :items="page.faq.items" />
        </UCard>
      </Motion>
    </UPageSection>

    <!-- Contact -->
    <UPageSection
      id="contact"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height) bg-neutral-300',
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
          :ui="{
            wrapper: 'items-center text-center',
            leading: 'flex justify-center'
          }"
        />
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotion(0.3)"
        class="w-full"
      >
        <UPageGrid class="lg:grid-cols-2">
          <UCard
            v-for="(user, index) in page.contact.team"
            :key="index"
          >
            <UUser
              v-bind="user"
              :name="user.name"
              :description="user.role"
              orientation="vertical"
              :avatar="{
                src: publicAsset(user.img),
                loading: 'lazy',
                icon: 'i-lucide-image',
                class: 'size-24'
              }"
              :ui="{ root: 'items-center', wrapper: 'items-center' }"
            />
          </UCard>
        </UPageGrid>
      </Motion>
    </UPageSection>

    <!-- Partners -->
    <UPageSection
      id="partners"
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
          {{ page.partners.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.partners.title }}
        </Motion>
      </template>

      <Motion
        as="span"
        v-bind="scrollMotion(0.2)"
        class="w-full overflow-hidden"
      >
        <UMarquee
          pause-on-hover
          :overlay="false"
          :ui="{ root: '[--gap:--spacing(4)]', content: 'w-auto py-1' }"
        >
          <UCard
            v-for="partner in page.partners.items"
            :key="partner.name"
            variant="outline"
            class="flex items-center justify-center"
          >
            <NuxtLink
              :to="partner.to"
              :target="partner.target"
            >
              <img
                :src="publicAsset(partner.img)"
                :alt="partner.name"
                class="h-12 object-contain mx-auto"
                loading="lazy"
              >
              <p class="font-semibold text-center mt-2 text-sm">
                {{ partner.name }}
              </p>
            </NuxtLink>
          </UCard>
        </UMarquee>
      </Motion>
    </UPageSection>
  </div>
</template>
