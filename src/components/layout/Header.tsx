export function Header() {
  return (
    <header className="py-6 px-4">
      <div className="flex items-center justify-center gap-2">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#10b981" />
        </svg>
        <span className="text-xl font-semibold text-white">My Qibla</span>
      </div>
    </header>
  )
}
