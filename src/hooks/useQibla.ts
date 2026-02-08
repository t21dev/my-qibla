import { useMemo, useCallback } from 'react'
import { useGeolocation } from './useGeolocation'
import { useDeviceOrientation } from './useDeviceOrientation'
import { calculateQiblaDirection, calculateDistanceToKaaba } from '../utils/qibla'

export interface QiblaState {
  // Qibla direction from North (0-360 degrees)
  qiblaDirection: number | null
  // Device heading from North (0-360 degrees)
  heading: number | null
  // Compass rotation needed to point to Qibla
  compassRotation: number
  // Distance to Kaaba in kilometers
  distanceToKaaba: number | null
  // Location accuracy in meters
  accuracy: number | null
  // Loading state
  loading: boolean
  // Error message
  error: string | null
  // Whether all permissions are granted
  isReady: boolean
  // Whether location permission is needed
  needsLocationPermission: boolean
  // Whether orientation permission is needed (iOS)
  needsOrientationPermission: boolean
  // Whether device is mobile
  isMobile: boolean
  // Request all necessary permissions
  requestPermissions: () => Promise<void>
}

export function useQibla(): QiblaState {
  const geo = useGeolocation()
  const orientation = useDeviceOrientation()

  const qiblaDirection = useMemo(() => {
    if (geo.latitude !== null && geo.longitude !== null) {
      return calculateQiblaDirection(geo.latitude, geo.longitude)
    }
    return null
  }, [geo.latitude, geo.longitude])

  const distanceToKaaba = useMemo(() => {
    if (geo.latitude !== null && geo.longitude !== null) {
      return calculateDistanceToKaaba(geo.latitude, geo.longitude)
    }
    return null
  }, [geo.latitude, geo.longitude])

  // Calculate the rotation needed for the compass to point to Qibla
  // This is a pure calculation based on current heading and qibla direction
  const compassRotation = useMemo(() => {
    if (qiblaDirection === null || orientation.heading === null) {
      return 0
    }
    // The compass needs to rotate by the difference between qibla direction and heading
    return qiblaDirection - orientation.heading
  }, [qiblaDirection, orientation.heading])

  const requestPermissions = useCallback(async () => {
    // Request location first
    geo.requestLocation()

    // Then request orientation (which may require user gesture on iOS)
    await orientation.requestPermission()
  }, [geo, orientation])

  const isReady =
    geo.hasLocation &&
    orientation.permissionState === 'granted' &&
    orientation.heading !== null

  const needsLocationPermission =
    geo.permissionState !== 'granted' && !geo.hasLocation

  const needsOrientationPermission = orientation.needsPermission

  const error = geo.error || orientation.error

  return {
    qiblaDirection,
    heading: orientation.heading,
    compassRotation,
    distanceToKaaba,
    accuracy: geo.accuracy,
    loading: geo.loading,
    error,
    isReady,
    needsLocationPermission,
    needsOrientationPermission,
    isMobile: orientation.isMobile,
    requestPermissions,
  }
}
