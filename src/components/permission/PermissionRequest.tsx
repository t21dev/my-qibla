import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Text, Heading, Caption } from '../ui/Typography'

interface PermissionRequestProps {
  onRequestPermissions: () => void
  loading: boolean
  error: string | null
}

export function PermissionRequest({
  onRequestPermissions,
  loading,
  error,
}: PermissionRequestProps) {
  return (
    <Card className="max-w-sm mx-auto text-center">
      {/* Compass icon */}
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#10b981" />
          </svg>
        </div>
      </div>

      <Heading className="mb-3">Enable Compass</Heading>

      <Text className="mb-6">
        To find the Qibla direction, we need access to your location and device compass.
        Your data stays on your device.
      </Text>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
          <Caption className="text-red-400">{error}</Caption>
        </div>
      )}

      <Button
        onClick={onRequestPermissions}
        loading={loading}
        size="lg"
        className="w-full"
      >
        Enable Compass
      </Button>

      <Caption className="block mt-4">
        Works offline once loaded
      </Caption>
    </Card>
  )
}
