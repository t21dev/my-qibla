import { usePWA } from '../../hooks/usePWA'
import { Button } from '../ui/Button'

export function PWAUpdatePrompt() {
  const { needRefresh, offlineReady, updateServiceWorker, dismiss } = usePWA()

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
              <Button onClick={() => updateServiceWorker()} size="sm">
                Update
              </Button>
              <Button onClick={dismiss} variant="ghost" size="sm">
                Later
              </Button>
            </div>
          </>
        ) : offlineReady ? (
          <>
            <p className="text-sm text-white mb-3">
              App ready for offline use
            </p>
            <Button onClick={dismiss} variant="ghost" size="sm">
              OK
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}
