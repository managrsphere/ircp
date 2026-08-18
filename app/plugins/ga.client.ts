export default defineNuxtPlugin(() => {
  const measurementId = 'G-CYMSSCYN03'
  const { cookiesEnabledIds } = useCookieControl()

  let configured = false

  // Define dataLayer/gtag immediately, regardless of consent state,
  // so 'consent default' can be set before anything loads.
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }

  window.gtag('consent', 'default', {
    analytics_storage: 'denied'
  })

  const initGtag = () => {
    const hasConsent = cookiesEnabledIds.value?.includes('analytics')

    if (!hasConsent) {
      return
    }

    if (!configured) {
      window.gtag('js', new Date())
      window.gtag('config', measurementId, { debug_mode: true })
      configured = true
    }

    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    })
  }

  watch(
    () => cookiesEnabledIds.value,
    initGtag,
    { immediate: true, deep: true }
  )
})
