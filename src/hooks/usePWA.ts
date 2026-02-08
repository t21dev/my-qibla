import { useState, useEffect, useCallback, useRef } from 'react'
import { registerSW } from 'virtual:pwa-register'

export interface PWAState {
  needRefresh: boolean
  offlineReady: boolean
  updateServiceWorker: () => Promise<void>
  dismiss: () => void
}

export function usePWA(): PWAState {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)
  const updateSWRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null)

  useEffect(() => {
    const update = registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true)
      },
      onOfflineReady() {
        setOfflineReady(true)
      },
      onRegisteredSW(_swUrl, registration) {
        // Check for updates periodically (every hour)
        if (registration) {
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000)
        }
      },
    })

    updateSWRef.current = update
  }, [])

  const updateServiceWorker = useCallback(async () => {
    if (updateSWRef.current) {
      await updateSWRef.current(true)
    }
  }, [])

  const dismiss = useCallback(() => {
    setNeedRefresh(false)
    setOfflineReady(false)
  }, [])

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
    dismiss,
  }
}
