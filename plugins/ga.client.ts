export default defineNuxtPlugin(() => {
  const measurementId = 'G-CYMSSCYN03'
  const { cookiesEnabledIds } = useCookieControl()

  const loadGtag = () => {
    if (typeof window === 'undefined' || window.gtag) {
      return
    }

    window.dataLayer = window.dataLayer || []

    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }

    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', measurementId, {
      anonymize_ip: true
    })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }

  watch(
    () => cookiesEnabledIds.value,
    (ids) => {
      if (ids?.includes('analytics')) {
        loadGtag()
      }
    },
    { immediate: true }
  )
})
