<script setup lang="ts">
import type { TableColumn, TabsItem } from '@nuxt/ui'

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

type ProgramRow = {
  time: string
  event?: string
  type?: string
  speakers?: Array<{
    name: string
  }>
}

function programSpeakerNames(row: ProgramRow) {
  return row.speakers?.map(speaker => speaker.name?.trim()).filter(Boolean).join(', ') ?? ''
}

function isBreakRow(row: ProgramRow) {
  return row.type === 'break'
}

type ProgramTrack = {
  title: string
  description?: string
  goals?: string[]
  rows: ProgramRow[]
}

type ProgramDay = {
  label: string
  slot: string
  tracks: ProgramTrack[]
}

type SpeakerItem = {
  img?: string
  name?: string
  role?: string
  title: string
  description: string
  language?: string
  country?: string
  speakers?: Array<{
    img?: string
    name: string
    role?: string
  }>
}

function speakerPeople(speaker: SpeakerItem) {
  if (speaker.speakers?.length) {
    return speaker.speakers
  }

  return [{
    img: speaker.img,
    name: speaker.name ?? '',
    role: speaker.role
  }]
}

function speakerHeadline(speaker: SpeakerItem) {
  return speakerPeople(speaker).map(person => person.name).filter(Boolean).join(' & ')
}

function speakerIsGroup(speaker: SpeakerItem) {
  return (speaker.speakers?.length ?? 0) > 1
}

function speakerRoleSummary(speaker: SpeakerItem) {
  return speakerPeople(speaker).map(person => person.role?.trim()).filter(Boolean).join(' · ')
}

function speakerPrimaryImage(speaker: SpeakerItem) {
  return speakerPeople(speaker).find(person => person.img)?.img ?? ''
}

function speakerInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')
}

function speakerCountryFlag(country?: SpeakerItem['country']) {
  if (!country) {
    return ''
  }

  const flags = country
    .split('|')
    .map(entry => entry.trim())
    .map((entry) => {
      const flagMap: Record<string, string> = {
        'Austria': '🇦🇹',
        'Germany': '🇩🇪',
        'Switzerland': '🇨🇭',
        'United Kingdom': '🇬🇧',
        'England': '🇬🇧',
        'Australia': '🇦🇺',
        'Canada': '🇨🇦',
        'United States': '🇺🇸',
        'USA': '🇺🇸',
        'Vanuatu': '🇻🇺',
        'South Korea': '🇰🇷',
        'Netherlands': '🇳🇱'
      }

      return flagMap[entry] ?? ''
    })
    .filter(Boolean)

  return flags.join('')
}

function speakerLanguageLabel(language?: SpeakerItem['language']) {
  return language?.toUpperCase() ?? ''
}

const programColumns: TableColumn<ProgramRow>[] = [
  {
    accessorKey: 'time',
    header: 'Zeit',
    meta: {
      class: {
        th: 'w-44',
        td: 'font-mono text-sm text-primary whitespace-nowrap'
      }
    }
  },
  {
    accessorKey: 'event',
    header: 'Programmpunkt',
    meta: {
      class: {
        td: 'min-w-0 whitespace-normal break-words hyphens-auto font-medium text-default'
      }
    }
  }
]

const programDays = computed<ProgramDay[]>(() => page.value?.program.schedule.days ?? [])

const programTabs = computed<TabsItem[]>(() =>
  programDays.value.map(day => ({
    label: day.label,
    value: day.slot,
    slot: day.slot
  }))
)

type SponsorTier = 'mainsponsor' | 'sponsor'

type SponsorItem = {
  img: string
  name: string
  tier?: SponsorTier
  to?: string
  target?: '_blank' | '_self'
  info: Array<{
    language: 'de' | 'en'
    description: string
  }>
}

const sponsorTierOrder: SponsorTier[] = ['mainsponsor', 'sponsor']
const sponsorTierLabels: Record<SponsorTier, string> = {
  mainsponsor: 'Hauptsponsor',
  sponsor: 'Sponsoren & Aussteller'
}

const sponsorGroups = computed(() => {
  const sponsors = (page.value?.sponsors.items ?? []) as SponsorItem[]

  return sponsorTierOrder
    .map(tier => ({
      tier,
      label: sponsorTierLabels[tier],
      items: sponsors.filter(item => item.tier === tier)
    }))
    .filter(group => group.items.length > 0)
})

function sponsorTierClasses(tier: SponsorTier) {
  const common = 'h-full overflow-hidden border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg'

  switch (tier) {
    case 'mainsponsor':
      return `${common} border-yellow-500/30 bg-yellow-500/5 shadow-sm`
    case 'sponsor':
      return `${common} border-sky-300/50 bg-sky-50/70`
    default:
      return `${common} border-default/60 bg-default/80`
  }
}

const isSponsorModalOpen = ref(false)
const isTicketModalOpen = ref(false)
const flyerModalOpen = ref(false)
const speakerDirectoryModalOpen = ref(false)

const flyerPdfUrl = '/docs/IRCP_Flyer_05.09.26.pdf'
const speakerDirectoryPdfUrl = '/docs/Sprecherverzeichnis_05.09%5B79%5D.pdf'

const selectedSponsor = ref<SponsorItem | null>(null)

const selectedLanguage = ref<'de' | 'en'>('de')

function openSponsorInfo(sponsor: SponsorItem) {
  selectedSponsor.value = sponsor
  // Prefer German, otherwise fall back to English

  isSponsorModalOpen.value = true
}

const speakers = computed<SpeakerItem[]>(() => (page.value?.callForSpeakers.speaker ?? []) as SpeakerItem[])
const workshopPosts = computed(() => [
  {
    src: '/workshop1.jpg',
    alt: 'Workshop'
  },
  {
    src: '/workshop2.jpg',
    alt: 'Workshop 1'
  },
  {
    src: '/workshop3.jpg',
    alt: 'Workshop 2'
  },
  {
    src: '/abendprogramm1.jpg',
    alt: 'Abendprogramm'
  },
  {
    src: '/abendprogramm2.jpg',
    alt: 'Abendprogramm 1'
  },
  {
    src: '/abendprogramm3.jpg',
    alt: 'Abendprogramm 2'
  }
])

const activeSpeaker = ref<SpeakerItem | null>(null)
const speakerModalOpen = ref(false)
const activeWorkshopPost = ref<(typeof workshopPosts.value)[number] | null>(null)
const workshopModalOpen = ref(false)

function openSpeaker(speaker: SpeakerItem) {
  activeSpeaker.value = speaker
  speakerModalOpen.value = true
}

function updateSpeakerModalOpen(open: boolean) {
  speakerModalOpen.value = open

  if (!open) {
    activeSpeaker.value = null
  }
}

function openWorkshopPost(post: (typeof workshopPosts.value)[number]) {
  activeWorkshopPost.value = post
  workshopModalOpen.value = true
}

function updateWorkshopModalOpen(open: boolean) {
  workshopModalOpen.value = open

  if (!open) {
    activeWorkshopPost.value = null
  }
}

function speakerCardName(speaker: SpeakerItem) {
  return speaker.name?.trim() || speakerHeadline(speaker)
}

function speakerCardRole(speaker: SpeakerItem) {
  return speaker.role?.trim() || speakerRoleSummary(speaker)
}

function speakerCardBadge(speaker: SpeakerItem) {
  return speakerIsGroup(speaker)
    ? `${speakerPeople(speaker).length} Speaker:innen`
    : (speaker.language ? speaker.language.toUpperCase() : '')
}

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
    title: 'IRCP 2026 - aktuelle Informationen',
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
            label="Tickets"
            color="primary"
            size="xl"
            @click="() => { isTicketModalOpen = true }"
          />
          <template
            v-for="link in page.hero.links"
            :key="link.label"
          >
            <UButton
              v-bind="link"
            />
          </template>
        </Motion>
      </template>

      <Motion
        as="span"
        v-bind="enterMotion(0.75)"
      >
        <img
          :src="'/marinaforum.jpg'"
          alt="REF in front of marinaforum Regensburg"
          class="w-full rounded-lg shadow-lg"
          loading="lazy"
        >
      </Motion>
    </UPageHero>

    <UModal
      v-model:open="isTicketModalOpen"
      title="Tickets & Registrierung"
      :ui="{ content: 'sm:max-w-lg' }"
    >
      <template #body>
        <div class="space-y-6 p-6 sm:p-8">
          <section class="space-y-3">
            <h3 class="text-base font-semibold text-default">
              Allgemeiner Ticketverkauf
            </h3>
            <p class="text-sm leading-relaxed text-dimmed">
              Wählen Sie die passende Ticketoption für Ihre Teilnahme am IRCP 2026.
            </p>
            <UButton
              :to="page.tickets.pricing[0]?.button.to"
              :target="page.tickets.pricing[0]?.button.target"
              label="Ticket"
              color="primary"
              size="lg"
              block
            />
            <UButton
              :to="page.tickets.pricing[1]?.button.to"
              :target="page.tickets.pricing[1]?.button.target"
              label="Ticket (Student:in)"
              color="primary"
              variant="soft"
              size="lg"
              block
            />
            <UButton
              :to="page.tickets.payment.to"
              :target="page.tickets.payment.target"
              label="Ticketkauf auf Rechnung"
              color="primary"
              variant="outline"
              size="lg"
              block
            />
          </section>

          <USeparator />

          <section class="space-y-3">
            <h3 class="text-base font-semibold text-default">
              Tagestickets
            </h3>
            <UButton
              to="https://buy.stripe.com/dRm00k4gv4qL2vceM99R606"
              target="_blank"
              label="Tagesticket (Normal)"
              color="primary"
              size="lg"
              block
            />
            <UButton
              to="https://buy.stripe.com/7sYbJ27sHbTd1r8bzX9R607"
              target="_blank"
              label="Tagesticket (Student:in)"
              variant="soft"
              size="lg"
              block
            />
          </section>
        </div>
      </template>
    </UModal>

    <UPageSection
      id="sponsors"
      :ui="{
        root: 'scroll-mt-(--ui-header-height) py-16 sm:py-24',
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
          {{ page.sponsors.headline }}
        </Motion>
      </template>
      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.sponsors.title }}
        </Motion>
      </template>
      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.sponsors.description }}
        </Motion>
      </template>
      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.25)"
        class="w-full space-y-8"
      >
        <div
          v-for="group in sponsorGroups"
          :key="group.tier"
          class="space-y-4"
        >
          <div class="flex items-center justify-center">
            <span
              :class="['font-mono uppercase tracking-[0.2em]',
                       group.tier === 'mainsponsor'
                         ? 'text-2xl font-bold text-primary'
                         : 'text-sm font-semibold '
              ]"
            >
              {{ group.label }}
            </span>
          </div>
          <div
            :class="[
              'grid gap-4',
              group.tier === 'mainsponsor'
                ? 'md:grid-cols-1'
                : 'md:grid-cols-3'
            ]"
          >
            <div
              v-for="sponsor in group.items"
              :key="sponsor.name"
              class="group"
            >
              <!-- Regular sponsor link -->
              <NuxtLink
                v-if="!sponsor.info && sponsor.to"
                :to="sponsor.to"
                :target="sponsor.target || '_self'"
                class="block h-full"
              >
                <UCard :class="sponsorTierClasses(group.tier)">
                  <div
                    class="flex min-h-28 items-center justify-center p-4 sm:p-6"
                  >
                    <img
                      :src="sponsor.img"
                      :alt="sponsor.name"
                      class="max-h-16 w-full object-contain sm:max-h-20"
                      loading="lazy"
                    >
                  </div>
                </UCard>
              </NuxtLink>
              <!-- Sponsor with information -->
              <button
                v-else-if="sponsor.info?.length"
                type="button"
                class="block h-full w-full text-left"
                @click="openSponsorInfo(sponsor)"
              >
                <UCard
                  :class="[
                    sponsorTierClasses(group.tier),
                    'h-full transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg'
                  ]"
                >
                  <div
                    class="flex min-h-28 items-center justify-center p-4 sm:p-6"
                  >
                    <img
                      :src="sponsor.img"
                      :alt="sponsor.name"
                      class="max-h-16 w-full object-contain sm:max-h-20"
                      loading="lazy"
                    >
                  </div>
                </UCard>
              </button>
              <!-- Sponsor without link or information -->
              <div
                v-else
                class="h-full"
              >
                <UCard :class="sponsorTierClasses(group.tier)">
                  <div
                    class="flex min-h-28 items-center justify-center p-4 sm:p-6"
                  >
                    <img
                      :src="sponsor.img"
                      :alt="sponsor.name"
                      class="max-h-16 w-full object-contain sm:max-h-20"
                      loading="lazy"
                    >
                  </div>
                </UCard>
              </div>
            </div>
          </div>
        </div>
      </Motion>
    </UPageSection>
    <!-- Sponsor information modal -->
    <UModal
      v-model:open="isSponsorModalOpen"
      scrollable
      :title="selectedSponsor?.name"
    >
      <template #body>
        <div
          v-if="selectedSponsor"
          class="p-6 sm:p-8"
        >
          <div class="mb-6 flex items-start justify-between gap-6">
            <UButton
              v-if="selectedSponsor.to"
              :to="selectedSponsor.to"
              :target="selectedSponsor.target || '_self'"
              icon="i-lucide-external-link"
              class="shrink-0"
            >
              Website
            </UButton>
            <!-- Language toggle -->
            <div
              v-if="selectedSponsor.info?.length > 1"
              class="flex shrink-0 rounded-lg bg-muted p-1"
            >
              <UButton
                v-if="selectedSponsor.info.some(info => info.language === 'de')"
                size="xs"
                :variant="selectedLanguage === 'de' ? 'solid' : 'ghost'"
                @click="() => {
                  selectedLanguage = 'de'
                }"
              >
                DE
              </UButton>
              <UButton
                v-if="selectedSponsor.info.some(info => info.language === 'en')"
                size="xs"
                :variant="selectedLanguage === 'en' ? 'solid' : 'ghost'"
                @click="() => {
                  selectedLanguage = 'en'
                }"
              >
                EN
              </UButton>
            </div>
          </div>
          <p class="text-sm leading-7 text-muted">
            {{ selectedSponsor.info.find(info => info.language === selectedLanguage)?.description }}
          </p>
        </div>
      </template>
    </UModal>

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
                :src="card.image"
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
        container: 'max-w-6xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-2xl mx-auto',
        description: 'max-w-2xl mx-auto text-dimmed'
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
          class="mx-auto max-w-4xl"
        />
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.4)"
        class="w-full overflow-hidden"
      >
        <div class="rounded-3xl border border-default bg-default/80 p-4 shadow-sm backdrop-blur sm:p-6">
          <UTabs
            :items="programTabs"
            :default-value="programTabs[0]?.value"
            color="neutral"
            variant="link"
            size="lg"
            class="w-full"
          >
            <template
              v-for="day in programDays"
              :key="day.slot"
              #[day.slot]
            >
              <div class="space-y-4 pt-6">
                <div
                  v-for="track in day.tracks"
                  :key="track.title"
                  class="space-y-3"
                >
                  <div class="flex items-center justify-between gap-3">
                    <h3 class="text-lg font-semibold tracking-tight text-default">
                      {{ track.title }}
                    </h3>
                    <UBadge
                      color="neutral"
                      variant="subtle"
                    >
                      Zeitplan
                    </UBadge>
                  </div>

                  <UCard class="overflow-hidden border border-default/60 bg-neutral-300/70">
                    <div
                      v-if="track.description || track.goals?.length"
                      class="space-y-2 border-b border-default/60 p-4 sm:p-5"
                    >
                      <h4 class="text-sm font-semibold text-default">
                        Was ist das Bildungsforum?
                      </h4>
                      <p
                        v-if="track.description"
                        class="max-w-4xl text-sm leading-relaxed text-muted"
                      >
                        {{ track.description }}
                      </p>
                      <div
                        v-if="track.goals?.length"
                        class="space-y-2"
                      >
                        <h4 class="text-sm font-semibold text-default">
                          Lernziele
                        </h4>
                        <ul class="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                          <li
                            v-for="goal in track.goals"
                            :key="goal"
                          >
                            {{ goal }}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <UTable
                      :data="track.rows"
                      :columns="programColumns"
                      :meta="{
                        class: {
                          tr: row => isBreakRow(row.original) ? 'bg-neutral-100' : ''
                        }
                      }"
                      :ui="{
                        base: 'w-full table-fixed',
                        thead: 'bg-transparent',
                        th: 'bg-transparent',
                        td: 'align-top'
                      }"
                    >
                      <template #event-cell="{ row }">
                        <div class="min-w-0 whitespace-normal hyphens-auto font-medium">
                          <p class="text-default">
                            {{ row.original.event }}
                          </p>
                          <p
                            v-if="programSpeakerNames(row.original)"
                            class="italic text-primary"
                          >
                            {{ programSpeakerNames(row.original) }}
                          </p>
                        </div>
                      </template>
                    </UTable>
                  </UCard>
                </div>
              </div>
            </template>
          </UTabs>
        </div>
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotion(0.3)"
        class="w-full"
      >
        <div
          role="button"
          tabindex="0"
          class="group mx-auto max-w-3xl cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label="Flyer vergrößern"
          @click="flyerModalOpen = true"
          @keydown.enter.prevent="flyerModalOpen = true"
          @keydown.space.prevent="flyerModalOpen = true"
        >
          <UCard class="overflow-hidden border border-default/60 bg-default/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
            <div class="relative overflow-hidden rounded-md border border-default/60 bg-neutral-100">
              <iframe
                :src="flyerPdfUrl"
                title="Vorschau des IRCP-Flyers"
                class="pointer-events-none h-48 w-full sm:h-64"
              />
              <div class="absolute inset-x-0 bottom-0 flex items-center justify-center bg-default/90 px-4 py-3 text-sm font-medium text-default backdrop-blur-sm">
                Flyer vergrößern
                <UIcon
                  name="i-lucide-maximize-2"
                  class="ml-2 size-4"
                />
              </div>
            </div>
          </UCard>
        </div>
      </Motion>

      <UModal
        v-model:open="flyerModalOpen"
        title="IRCP-Flyer"
        :ui="{ content: 'sm:max-w-6xl' }"
      >
        <template #body>
          <iframe
            :src="flyerPdfUrl"
            title="IRCP-Flyer"
            class="h-[75vh] min-h-128 w-full rounded-md border border-default/60"
          />
        </template>
      </UModal>
    </UPageSection>

    <!-- Speakers -->
    <UPageSection
      id="speakers"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height) bg-neutral-300',
        container: 'max-w-6xl',
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
        v-bind="scrollMotion(0.2)"
        class="w-full"
      >
        <UAlert
          :icon="page.callForSpeakers.alert.icon"
          :title="page.callForSpeakers.alert.title"
          :description="page.callForSpeakers.alert.description"
          color="info"
          variant="subtle"
          orientation="horizontal"
          class="mt-6"
        />
      </Motion>

      <div class="w-full">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <button
            v-for="speaker in speakers"
            :key="speaker.name || speakerHeadline(speaker)"
            type="button"
            class="group block h-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-default"
            @click="openSpeaker(speaker)"
          >
            <UCard class="h-full overflow-hidden border border-default/60 bg-default/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <div class="aspect-4/5 w-full overflow-hidden rounded-md bg-neutral-200">
                <div
                  v-if="speakerIsGroup(speaker)"
                  class="flex h-full flex-col gap-3 p-3"
                >
                  <div class="grid flex-1 grid-cols-2 gap-2">
                    <div
                      v-for="person in speakerPeople(speaker).slice(0, 4)"
                      :key="person.name"
                      class="overflow-hidden rounded-xl bg-default/70"
                    >
                      <img
                        v-if="person.img"
                        :src="person.img"
                        :alt="person.name"
                        class="h-full w-full object-cover"
                        loading="lazy"
                      >
                      <div
                        v-else
                        class="flex h-full min-h-28 items-center justify-center bg-primary/10 text-sm font-semibold text-primary"
                      >
                        {{ speakerInitials(person.name) }}
                      </div>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <p class="text-xs font-medium uppercase tracking-[0.12em] text-primary/80">
                      {{ speakerCardBadge(speaker) }}
                    </p>
                  </div>
                </div>

                <img
                  v-else-if="speakerPrimaryImage(speaker)"
                  :src="speakerPrimaryImage(speaker)"
                  :alt="speakerCardName(speaker)"
                  class="h-full w-full object-cover"
                  loading="lazy"
                >
                <div
                  v-else
                  class="flex h-full items-center justify-center p-4 text-center"
                >
                  <div class="space-y-2">
                    <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {{ speakerInitials(speakerCardName(speaker)) }}
                    </div>
                    <p class="text-sm font-medium text-default">
                      {{ speakerCardName(speaker) }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="space-y-2 pt-4">
                <div class="space-y-1">
                  <p class="text-base font-semibold tracking-tight text-default line-clamp-2">
                    <span
                      v-if="speakerCountryFlag(speaker.country)"
                      class="mr-2"
                      aria-hidden="true"
                    >
                      {{ speakerCountryFlag(speaker.country) }}
                    </span>
                    {{ speakerCardName(speaker) }}
                    <span
                      v-if="speakerLanguageLabel(speaker.language)"
                      class="ml-2 text-xs font-medium uppercase tracking-[0.12em] text-primary/80"
                    >
                      {{ speakerLanguageLabel(speaker.language) }}
                    </span>
                  </p>
                  <p
                    v-if="!speakerIsGroup(speaker)"
                    class="text-sm leading-relaxed text-dimmed line-clamp-2"
                  >
                    {{ speakerCardRole(speaker) }}
                  </p>
                </div>
                <p class="text-xs font-medium uppercase tracking-[0.12em] text-primary/80 transition-colors group-hover:text-primary">
                  Vortrag ansehen
                </p>
              </div>
            </UCard>
          </button>
        </div>
      </div>

      <Motion
        as="div"
        v-bind="scrollMotion(0.25)"
        class="w-full"
      >
        <div
          role="button"
          tabindex="0"
          class="group mx-auto max-w-3xl cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label="Sprecherverzeichnis vergrößern"
          @click="speakerDirectoryModalOpen = true"
          @keydown.enter.prevent="speakerDirectoryModalOpen = true"
          @keydown.space.prevent="speakerDirectoryModalOpen = true"
        >
          <UCard class="overflow-hidden border border-default/60 bg-default/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
            <div class="relative overflow-hidden rounded-md border border-default/60 bg-neutral-100">
              <iframe
                :src="speakerDirectoryPdfUrl"
                title="Vorschau des Sprecherverzeichnisses"
                class="pointer-events-none h-72 w-full sm:h-96"
              />
              <div class="absolute inset-x-0 bottom-0 flex items-center justify-center bg-default/90 px-4 py-3 text-sm font-medium text-default backdrop-blur-sm">
                Sprecherverzeichnis vergrößern
                <UIcon
                  name="i-lucide-maximize-2"
                  class="ml-2 size-4"
                />
              </div>
            </div>
          </UCard>
        </div>
      </Motion>

      <UModal
        :open="speakerModalOpen"
        :scrollable="true"
        :ui="{ content: 'sm:max-w-3xl' }"
        @update:open="updateSpeakerModalOpen"
      >
        <template #body>
          <div
            v-if="activeSpeaker"
            class="grid gap-6 sm:grid-cols-[minmax(0,320px)_minmax(0,1fr)]"
          >
            <div
              v-if="speakerIsGroup(activeSpeaker)"
              class="space-y-3"
            >
              <div class="grid gap-3 sm:grid-cols-2">
                <div
                  v-for="person in activeSpeaker.speakers"
                  :key="person.name"
                  class="overflow-hidden rounded-2xl border border-default/60 bg-default/60"
                >
                  <img
                    v-if="person.img"
                    :src="person.img"
                    :alt="person.name"
                    class="aspect-4/5 w-full rounded-2xl object-cover"
                    loading="lazy"
                  >
                  <div
                    v-else
                    class="aspect-4/5 flex w-full items-center justify-center bg-neutral-200"
                  >
                    <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {{ speakerInitials(person.name) }}
                    </div>
                  </div>
                  <div class="space-y-1 p-4 pt-3">
                    <p class="text-sm font-medium text-default">
                      {{ person.name }}
                    </p>
                    <p class="text-sm leading-relaxed text-dimmed">
                      {{ person.role }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <img
              v-else
              :src="activeSpeaker.img || ''"
              :alt="speakerCardName(activeSpeaker)"
              class="aspect-4/5 w-full rounded-2xl object-cover"
              loading="lazy"
            >

            <div class="space-y-4">
              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-[0.12em] text-primary">
                  Speaker:in
                </p>
                <h3 class="text-2xl font-semibold tracking-tight text-default">
                  <span
                    v-if="speakerCountryFlag(activeSpeaker.country)"
                    class="mr-2"
                    aria-hidden="true"
                  >
                    {{ speakerCountryFlag(activeSpeaker.country) }}
                  </span>
                  {{ speakerCardName(activeSpeaker) }}
                  <span
                    v-if="speakerLanguageLabel(activeSpeaker.language)"
                    class="ml-2 text-sm font-medium uppercase tracking-[0.12em] text-primary/80"
                  >
                    {{ speakerLanguageLabel(activeSpeaker.language) }}
                  </span>
                </h3>
                <p class="text-base leading-relaxed text-dimmed">
                  {{ speakerCardRole(activeSpeaker) }}
                </p>
              </div>

              <UAlert
                color="info"
                variant="soft"
                :title="activeSpeaker.title"
                :description="activeSpeaker.description"
              />
            </div>
          </div>
        </template>
      </UModal>

      <UModal
        v-model:open="speakerDirectoryModalOpen"
        title="Sprecherverzeichnis"
        :ui="{ content: 'sm:max-w-6xl' }"
      >
        <template #body>
          <iframe
            :src="speakerDirectoryPdfUrl"
            title="Sprecherverzeichnis"
            class="h-[75vh] min-h-128 w-full rounded-md border border-default/60"
          />
        </template>
      </UModal>
    </UPageSection>

    <!-- Workshops -->
    <UPageSection
      id="workshops"
      :ui="{
        root: 'py-16 sm:py-24 scroll-mt-(--ui-header-height)',
        container: 'max-w-6xl',
        headline: 'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-2xl mx-auto text-dimmed'
      }"
    >
      <template #headline>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ page.workshops.headline }}
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ page.workshops.title }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.2)"
          class="inline-block"
        >
          {{ page.workshops.description }}
        </Motion>
      </template>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.35)"
        class="w-full"
      >
        <div class="grid gap-6 md:grid-cols-3">
          <button
            v-for="post in workshopPosts"
            :key="post.src"
            type="button"
            class="group block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-default"
            @click="openWorkshopPost(post)"
          >
            <UCard class="overflow-hidden border border-default/60 bg-default/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <div class="relative overflow-hidden rounded-md">
                <img
                  :src="post.src"
                  :alt="post.alt"
                  class="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div class="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  Vergrößern
                </div>
              </div>
            </UCard>
          </button>
        </div>
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotionLarge(0.45)"
        class="w-full mt-8"
      >
        <UCard class="overflow-hidden border border-default/60 bg-default/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="flex h-full flex-col justify-between gap-4 p-1 sm:p-2 md:flex-row md:items-center md:p-6">
            <div class="space-y-2">
              <p class="text-base font-semibold tracking-tight text-default">
                {{ page.workshops.registration.title }}
              </p>
              <p class="text-sm leading-relaxed text-dimmed">
                {{ page.workshops.registration.description }}
              </p>
            </div>

            <UButton
              :to="`mailto:${page.workshops.registration.mail}?subject=${encodeURIComponent(page.workshops.registration.subject)}`"
              :label="page.workshops.registration.mail"
              icon="i-lucide-mail"
              color="primary"
              variant="solid"
            />
          </div>
        </UCard>
      </Motion>

      <UModal
        :open="workshopModalOpen"
        :scrollable="true"
        :ui="{ content: 'sm:max-w-4xl' }"
        @update:open="updateWorkshopModalOpen"
      >
        <template #body>
          <div
            v-if="activeWorkshopPost"
            class="space-y-4"
          >
            <img
              :src="activeWorkshopPost.src"
              :alt="activeWorkshopPost.alt"
              class="w-full rounded-2xl object-contain"
              loading="lazy"
            >
            <p class="text-sm text-dimmed">
              {{ activeWorkshopPost.alt }}
            </p>
          </div>
        </template>
      </UModal>
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
          color="info"
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

      <Motion
        as="div"
        v-bind="scrollMotion(0.3)"
        class="w-full"
      >
        <div class="w-full flex items-center justify-between gap-8">
          <UButton
            label="Neu: Tagesticket"
            class="w-full hover:cursor-pointer"
            size="xl"
            variant="subtle"
            to="https://buy.stripe.com/dRm00k4gv4qL2vceM99R606"
            target="_blank"
          />
          <UButton
            label="Neu: Tagesticket Student:in"
            class="w-full hover:cursor-pointer"
            size="xl"
            variant="subtle"
            to="https://buy.stripe.com/7sYbJ27sHbTd1r8bzX9R607"
            target="_blank"
          />
        </div>
      </Motion>

      <Motion
        as="div"
        v-bind="scrollMotion(0.4)"
        class="w-full"
      >
        <UButton
          :to="page.tickets.payment.to"
          :label="page.tickets.payment.label"
          :target="page.tickets.payment.target"
          icon="i-lucide-info"
          color="primary"
          variant="outline"
          size="xl"
          class="flex items-center justify-center mx-auto mt-6"
        />
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
                :src="card.image"
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
                src: user.img,
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
                :src="partner.img"
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
      <Motion
        as="div"
        v-bind="scrollMotion(0.3)"
        class="w-full mt-8"
      >
        <USeparator class="mb-8" />
        <div class="grid gap-6 md:grid-cols-2">
          <NuxtLink
            v-for="host in page.partners.hosts"
            :key="host.name"
            :to="host.to"
            :target="host.target"
            class="group block h-full"
          >
            <UCard class="h-full overflow-hidden border border-default/60 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <div class="flex h-full min-h-56 flex-col items-center justify-center px-8 py-8 text-center">
                <div class="flex w-full items-center justify-center rounded-2xl bg-neutral-100/80 px-6 py-6">
                  <img
                    :src="host.img"
                    :alt="host.name"
                    class="max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  >
                </div>
                <p class="mt-5 text-sm font-semibold tracking-tight text-default">
                  {{ host.name }}
                </p>
              </div>
            </UCard>
          </NuxtLink>
        </div>
        <div>
          <UCard
            v-if="page.partners.callout"
            :description="page.partners.callout.description"
            color="info"
            variant="subtle"
            class="mt-8"
          />
        </div>
      </Motion>
    </UPageSection>
  </div>
</template>
