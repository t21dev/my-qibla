import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Compass } from './components/compass/Compass'
import { PermissionRequest } from './components/permission/PermissionRequest'
import { PWAUpdatePrompt } from './components/pwa/PWAUpdatePrompt'
import { useQibla } from './hooks/useQibla'
import { Box } from './components/ui/Box'
import { Caption } from './components/ui/Typography'

function App() {
  const qibla = useQibla()

  const showCompass = qibla.isReady || (qibla.heading !== null && qibla.qiblaDirection !== null)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {showCompass ? (
          <Box center className="gap-6">
            <Compass
              rotation={qibla.compassRotation}
              heading={qibla.heading}
              qiblaDirection={qibla.qiblaDirection}
            />

            {qibla.distanceToKaaba !== null && (
              <div className="text-center">
                <Caption>
                  {qibla.distanceToKaaba < 1
                    ? `${Math.round(qibla.distanceToKaaba * 1000)} m to Kaaba`
                    : `${Math.round(qibla.distanceToKaaba).toLocaleString()} km to Kaaba`}
                </Caption>
              </div>
            )}

            {qibla.accuracy !== null && qibla.accuracy > 100 && (
              <div className="text-center">
                <Caption className="text-yellow-500">
                  Location accuracy: ~{Math.round(qibla.accuracy)}m
                </Caption>
              </div>
            )}
          </Box>
        ) : (
          <PermissionRequest
            onRequestPermissions={qibla.requestPermissions}
            loading={qibla.loading}
            error={qibla.error}
          />
        )}
      </main>

      <Footer />
      <PWAUpdatePrompt />
    </div>
  )
}

export default App
