import { useRef, useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

interface CompassProps {
  rotation: number
  heading: number | null
  qiblaDirection: number | null
  className?: string
}

// Normalize angle to [-180, 180] for shortest path calculation
function normalizeAngle(angle: number): number {
  while (angle > 180) angle -= 360
  while (angle < -180) angle += 360
  return angle
}

// Tolerance in degrees for "aligned" state (±10 degrees)
const ALIGNMENT_TOLERANCE = 10

export function Compass({ rotation, heading, qiblaDirection, className }: CompassProps) {
  const directions = ['N', 'E', 'S', 'W']
  const degreeMarks = Array.from({ length: 12 }, (_, i) => i * 30)

  // Track smooth rotation to avoid 360-degree jumps
  const [smoothRotation, setSmoothRotation] = useState(rotation)
  const previousRotationRef = useRef(rotation)

  useEffect(() => {
    // Calculate shortest path to new rotation
    const diff = normalizeAngle(rotation - previousRotationRef.current)
    const newRotation = previousRotationRef.current + diff
    previousRotationRef.current = newRotation
    setSmoothRotation(newRotation)
  }, [rotation])

  // Check if Qibla is aligned (rotation close to 0)
  const normalizedRotation = normalizeAngle(smoothRotation)
  const isAligned = Math.abs(normalizedRotation) <= ALIGNMENT_TOLERANCE

  return (
    <div className={cn('relative', className)}>
      {/* Outer container with glass effect */}
      <div className="glass rounded-full p-4">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          {/* Fixed alignment line - turns green when aligned */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              aria-hidden="true"
            >
              {/* Alignment line from center to top */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="20"
                stroke={isAligned ? '#10b981' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isAligned ? '3' : '2'}
                strokeLinecap="round"
                className="transition-all duration-200"
              />
              {/* Glow effect when aligned */}
              {isAligned && (
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="20"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.3"
                />
              )}
            </svg>
          </div>

          {/* Compass ring that rotates */}
          <div
            className="compass-rotate absolute inset-0"
            style={{ transform: `rotate(${smoothRotation}deg)` }}
          >
            {/* Outer ring */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              aria-hidden="true"
            >
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />

              {/* Degree marks */}
              {degreeMarks.map((deg) => {
                const angle = (deg - 90) * (Math.PI / 180)
                const x1 = 100 + 85 * Math.cos(angle)
                const y1 = 100 + 85 * Math.sin(angle)
                const x2 = 100 + 92 * Math.cos(angle)
                const y2 = 100 + 92 * Math.sin(angle)
                return (
                  <line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                  />
                )
              })}

              {/* Minor degree marks */}
              {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
                if (deg % 30 === 0) return null
                const angle = (deg - 90) * (Math.PI / 180)
                const x1 = 100 + 88 * Math.cos(angle)
                const y1 = 100 + 88 * Math.sin(angle)
                const x2 = 100 + 92 * Math.cos(angle)
                const y2 = 100 + 92 * Math.sin(angle)
                return (
                  <line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.5"
                  />
                )
              })}

              {/* Direction labels */}
              {directions.map((dir, i) => {
                const deg = i * 90
                const angle = (deg - 90) * (Math.PI / 180)
                const x = 100 + 75 * Math.cos(angle)
                const y = 100 + 75 * Math.sin(angle)
                return (
                  <text
                    key={dir}
                    x={x}
                    y={y}
                    fill={dir === 'N' ? '#10b981' : 'rgba(255,255,255,0.6)'}
                    fontSize="14"
                    fontWeight={dir === 'N' ? '600' : '400'}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {dir}
                  </text>
                )
              })}

              {/* Qibla indicator arrow (gold) - points up when compass shows Qibla direction */}
              <g>
                {/* Arrow pointing up (to Qibla) */}
                <path
                  d="M100 15 L93 35 L100 30 L107 35 Z"
                  fill="#d4af37"
                />
                {/* Kaaba icon at the tip */}
                <rect
                  x="95"
                  y="8"
                  width="10"
                  height="10"
                  fill="#d4af37"
                  rx="1"
                />
              </g>

              {/* Center circle */}
              <circle
                cx="100"
                cy="100"
                r="6"
                fill="#10b981"
              />
              <circle
                cx="100"
                cy="100"
                r="3"
                fill="white"
              />
            </svg>
          </div>

          {/* Fixed direction indicator at top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
            <svg width="20" height="12" viewBox="0 0 20 12" className="drop-shadow-lg">
              <path d="M10 12 L0 0 L20 0 Z" fill={isAligned ? '#10b981' : '#10b981'} />
            </svg>
          </div>
        </div>
      </div>

      {/* Alignment indicator text */}
      {isAligned && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50">
          <span className="text-xs font-medium text-emerald-400">Facing Qibla</span>
        </div>
      )}

      {/* Heading display */}
      <div className="mt-8 text-center">
        <div className="text-2xl font-semibold text-white">
          {heading !== null ? `${Math.round(heading)}°` : '--°'}
        </div>
        {qiblaDirection !== null && (
          <div className="text-sm text-gray-400 mt-1">
            Qibla: {Math.round(qiblaDirection)}° from North
          </div>
        )}
      </div>
    </div>
  )
}
