import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export function PWAUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setNeedRefresh(true)
              }
            })
          }
        })
      })

      // Check if already cached
      navigator.serviceWorker.ready.then(() => {
        setOfflineReady(true)
      })
    }
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleDismiss = () => {
    setNeedRefresh(false)
    setOfflineReady(false)
  }

  if (!needRefresh && !offlineReady) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80">
      <div className="glass rounded-xl p-4 shadow-xl">
        {needRefresh ? (
          <>
            <p className="text-sm text-white mb-3">
              A new version is available!
            </p>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} size="sm">
                Refresh
              </Button>
              <Button onClick={handleDismiss} variant="ghost" size="sm">
                Later
              </Button>
            </div>
          </>
        ) : offlineReady ? (
          <>
            <p className="text-sm text-white mb-3">
              App ready for offline use
            </p>
            <Button onClick={handleDismiss} variant="ghost" size="sm">
              Dismiss
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}
