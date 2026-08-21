export default defineNuxtPlugin(() => {
  const { cookiesEnabledIds } = useCookieControl()
  const { initialize } = useGtag()

  const initializeAnalytics = () => {
    if (!cookiesEnabledIds.value?.includes('analytics')) {
      return
    }

    initialize()

    if (import.meta.dev) {
      console.info('[GA] Google Analytics initialized.')
    }
  }

  watch(
    () => cookiesEnabledIds.value,
    initializeAnalytics,
    {
      immediate: true,
      deep: true
    }
  )
})
