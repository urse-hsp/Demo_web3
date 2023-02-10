const STORAGE_PREFIX = 'WEB_'

export function storage(key: string, value?: any) {
  if (value !== undefined) {
    return window.localStorage.setItem(STORAGE_PREFIX + key, value)
  }
  return window.localStorage.getItem(STORAGE_PREFIX + key)
}
