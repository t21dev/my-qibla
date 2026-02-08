import { useState, useCallback, useEffect, useRef } from 'react'

export interface DeviceOrientationState {
  heading: number | null
  error: string | null
  permissionState: 'granted' | 'denied' | 'prompt' | null
  isSupported: boolean
}

// Check if we're on iOS 13+ which requires permission
function isIOS13Plus(): boolean {
  return (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
  )
}

export function useDeviceOrientation() {
  const [state, setState] = useState<DeviceOrientationState>({
    heading: null,
    error: null,
    permissionState: null,
    isSupported: typeof window !== 'undefined' && 'DeviceOrientationEvent' in window,
  })

  const headingRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  // Smooth the heading to reduce jitter
  const smoothHeading = useCallback((newHeading: number): number => {
    if (headingRef.current === null) {
      return newHeading
    }

    // Calculate the difference, accounting for the 0/360 boundary
    let diff = newHeading - headingRef.current
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360

    // Apply smoothing factor (0.3 = 30% of new value, 70% of old value)
    const smoothed = headingRef.current + diff * 0.3

    // Normalize to 0-360
    return ((smoothed % 360) + 360) % 360
  }, [])

  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      // Throttle updates to ~60fps
      const now = performance.now()
      if (now - lastUpdateRef.current < 16) return
      lastUpdateRef.current = now

      // Get the compass heading
      // On iOS, webkitCompassHeading gives magnetic north heading
      // On Android, alpha gives the heading but needs adjustment
      let heading: number | null = null

      const webkitEvent = event as DeviceOrientationEvent & { webkitCompassHeading?: number }

      if (webkitEvent.webkitCompassHeading !== undefined) {
        // iOS - webkitCompassHeading is degrees from magnetic north (0-360)
        heading = webkitEvent.webkitCompassHeading
      } else if (event.alpha !== null) {
        // Android - alpha is the rotation around the z-axis (0-360)
        // We need to convert it to a compass heading
        // alpha = 0 when device is pointing at the same direction as during initialization
        // We need 360 - alpha to get compass heading
        heading = (360 - event.alpha) % 360
      }

      if (heading !== null) {
        const smoothed = smoothHeading(heading)
        headingRef.current = smoothed

        // Use RAF for smooth updates
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
        rafRef.current = requestAnimationFrame(() => {
          setState((prev) => ({
            ...prev,
            heading: smoothed,
          }))
        })
      }
    },
    [smoothHeading]
  )

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: 'Device orientation is not supported on this device',
      }))
      return false
    }

    if (isIOS13Plus()) {
      try {
        const DeviceOrientationEventWithPermission = DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<'granted' | 'denied'>
        }
        const permission = await DeviceOrientationEventWithPermission.requestPermission()

        if (permission === 'granted') {
          setState((prev) => ({ ...prev, permissionState: 'granted', error: null }))
          window.addEventListener('deviceorientation', handleOrientation, true)
          return true
        } else {
          setState((prev) => ({
            ...prev,
            permissionState: 'denied',
            error: 'Compass permission was denied. Please enable it in your device settings.',
          }))
          return false
        }
      } catch {
        setState((prev) => ({
          ...prev,
          error: 'Failed to request compass permission. Please try again.',
        }))
        return false
      }
    } else {
      // Non-iOS or older iOS - no permission needed
      setState((prev) => ({ ...prev, permissionState: 'granted', error: null }))
      window.addEventListener('deviceorientation', handleOrientation, true)
      return true
    }
  }, [state.isSupported, handleOrientation])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleOrientation])

  return {
    ...state,
    requestPermission,
    needsPermission: isIOS13Plus() && state.permissionState !== 'granted',
  }
}
