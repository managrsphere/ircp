export function usePublicAsset() {
  const {
    app: { baseURL }
  } = useRuntimeConfig()

  return (path: string) => {
    if (!path) {
      return path
    }

    if (/^(?:https?:)?\/\//.test(path) || path.startsWith('data:')) {
      return path
    }

    const normalizedBase = (baseURL || '/').replace(/\/+$/, '')
    const normalizedPath = path.replace(/^\/+/, '')

    return normalizedBase ? `${normalizedBase}/${normalizedPath}` : `/${normalizedPath}`
  }
}
