export default defineNuxtPlugin(() => {
  const measurementId = 'G-CYMSSCYN03'

  const initGtag = () => {
    if (typeof window === 'undefined' || !window.gtag) {
      return
    }

    window.dataLayer = window.dataLayer || []
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      anonymize_ip: true
    })
  }

  watch(
    () => useCookieControl().cookiesEnabledIds.value,
    (ids) => {
      if (ids?.includes('analytics')) {
        initGtag()
      }
    },
    { immediate: true }
  )
})
