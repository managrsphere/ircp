export default defineNuxtPlugin(() => {
  const CONSENT_VERSION = '2'

  const consentVersion = useCookie('consent-version')

  if (consentVersion.value !== CONSENT_VERSION) {
    const consentGiven = useCookie('ncc_c')
    const enabledIds = useCookie('ncc_e')

    consentGiven.value = null
    enabledIds.value = null

    consentVersion.value = CONSENT_VERSION

    window.location.reload()
  }
})
