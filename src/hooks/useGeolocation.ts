import { useState, useCallback, useEffect } from 'react'

export interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
  permissionState: PermissionState | null
}

const STORAGE_KEY = 'qibla-last-location'

interface StoredLocation {
  latitude: number
  longitude: number
  timestamp: number
}

function getStoredLocation(): StoredLocation | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore storage errors
  }
  return null
}

function storeLocation(latitude: number, longitude: number): void {
  try {
    const data: StoredLocation = {
      latitude,
      longitude,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(() => {
    const stored = getStoredLocation()
    return {
      latitude: stored?.latitude ?? null,
      longitude: stored?.longitude ?? null,
      accuracy: null,
      error: null,
      loading: false,
      permissionState: null,
    }
  })

  // Check permission state on mount
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          setState((prev) => ({ ...prev, permissionState: result.state }))
          result.onchange = () => {
            setState((prev) => ({ ...prev, permissionState: result.state }))
          }
        })
        .catch(() => {
          // Permissions API not fully supported
        })
    }
  }, [])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        storeLocation(latitude, longitude)
        setState((prev) => ({
          ...prev,
          latitude,
          longitude,
          accuracy,
          error: null,
          loading: false,
          permissionState: 'granted',
        }))
      },
      (error) => {
        let errorMessage: string
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission was denied. Please enable it in your browser settings.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
          default:
            errorMessage = 'An unknown error occurred while getting your location.'
        }
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
          permissionState: error.code === error.PERMISSION_DENIED ? 'denied' : prev.permissionState,
        }))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  }, [])

  return {
    ...state,
    requestLocation,
    hasLocation: state.latitude !== null && state.longitude !== null,
  }
}
