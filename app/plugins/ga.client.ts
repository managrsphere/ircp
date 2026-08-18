export default defineNuxtPlugin(() => {
  const measurementId = 'G-CYMSSCYN03'
  const { cookiesEnabledIds } = useCookieControl()

  let isConfigured = false
  let hasConsentModeDefault = false
  let scriptLoaded = false

  const win = window as Window & {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }

  win.dataLayer = win.dataLayer || []

  win.gtag = win.gtag || ((...args: unknown[]) => {
    win.dataLayer!.push(args)
  })

  const setConsentDefaults = () => {
    if (hasConsentModeDefault) {
      return
    }

    win.gtag!('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    })

    hasConsentModeDefault = true
  }

  const loadGoogleAnalytics = () => {
    if (scriptLoaded) {
      return
    }

    scriptLoaded = true

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`

    document.head.appendChild(script)

    script.onload = () => {
      win.gtag!('js', new Date())
      win.gtag!('config', measurementId)

      isConfigured = true

      if (import.meta.dev) {
        console.info('[GA] Google Analytics initialized.')
      }
    }

    script.onerror = () => {
      scriptLoaded = false

      if (import.meta.dev) {
        console.error('[GA] Failed to load Google Analytics.')
      }
    }
  }

  const applyConsent = () => {
    const hasAnalyticsConsent
      = cookiesEnabledIds.value?.includes('analytics')

    setConsentDefaults()

    if (!hasAnalyticsConsent) {
      win.gtag!('consent', 'update', {
        analytics_storage: 'denied'
      })

      if (import.meta.dev) {
        console.info('[GA] Waiting for analytics consent.')
      }

      return
    }

    win.gtag!('consent', 'update', {
      analytics_storage: 'granted'
    })

    loadGoogleAnalytics()
  }

  watch(
    () => cookiesEnabledIds.value,
    applyConsent,
    {
      immediate: true,
      deep: true
    }
  )

  return {
    provide: {
      analytics: {
        track: (...args: unknown[]) => {
          if (!isConfigured) {
            return
          }

          win.gtag!('event', ...args)
        }
      }
    }
  }
})
