// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    '@dargmuesli/nuxt-cookie-control',
    'nuxt-gtag'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://ircp-regensburg.de',
    name: 'IRCP Regensburg 2026',
    defaultLocale: 'de'
  },

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      routes: [
        '/'
      ]
    }
  },

  vite: {
    optimizeDeps: {
      include: []
    }
  },

  cookieControl: {
    locales: ['de'],
    barPosition: 'bottom-full',
    isModalForced: true, // important for compliance
    closeModalOnClickOutside: false,
    isAcceptNecessaryButtonEnabled: true,
    isControlButtonEnabled: true,
    // IMPORTANT: no iframe auto-load
    isIframeBlocked: false,
    cookies: {
      necessary: [
        {
          id: 'essential',
          name: 'Essenzielle Cookies',
          description: {
            de: 'Diese Cookies sind für den Betrieb der Website erforderlich.'
          },
          isPreselected: true
        }
      ],

      optional: [
        {
          id: 'analytics',
          name: 'Analytics',
          description: {
            de: 'Google Analytics zur Auswertung anonymisierter Besucherzahlen.'
          },
          targetCookieIds: ['_ga', '_gat', '_gid'],
          isPreselected: false
        },
        {
          id: 'external_media',
          name: 'Externe Medien (Instagram)',
          description: {
            de: 'Lädt Inhalte von Instagram (LightWidget). Erst nach Zustimmung.'
          }
        }
      ]
    },
    cookieNameIsConsentGiven: 'ncc_c',
    cookieNameCookiesEnabledIds: 'ncc_e',
    cookieOptions: {
      path: '/',
      sameSite: 'strict'
    },
    cookieExpiryOffsetMs: 1000 * 60 * 60 * 24 * 365
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  gtag: {
    id: 'G-CYMSSCYN03',
    initMode: 'manual'
  },

  ogImage: {
    zeroRuntime: true
  }
})
