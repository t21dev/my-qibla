# My Qibla

<p align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="My Qibla Logo">
</p>

<p align="center">
  <strong>Find the Qibla direction from anywhere in the world</strong>
</p>

<p align="center">
  A beautiful, offline-capable Qibla compass app for Muslims
</p>

---

## Features

- **Accurate Qibla Direction** - Uses the Haversine formula to calculate the precise bearing to Kaaba
- **Smooth Compass Animation** - Real-time compass that responds to device movement
- **Offline Support** - Works without internet once loaded (PWA)
- **Privacy First** - Your location data never leaves your device
- **Minimal Design** - Clean, distraction-free interface
- **Cross Platform** - Works on iOS, Android, and desktop browsers

## Tech Stack

- **React 19** with React Compiler
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Vite 7** for fast development and builds
- **vite-plugin-pwa** for offline support

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/t21dev/my-qibla.git
cd my-qibla

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:5173 |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Offline Support

My Qibla is a Progressive Web App (PWA) that works offline:

1. Visit the app in your browser
2. Grant location and compass permissions
3. The app caches automatically
4. Works offline after first load

To install on your device:
- **iOS**: Tap Share > Add to Home Screen
- **Android**: Tap the install prompt or Menu > Install App

## How It Works

1. **Location**: Uses the Geolocation API to get your coordinates
2. **Compass**: Uses the DeviceOrientation API for real-time heading
3. **Calculation**: Applies the spherical law of cosines to find the bearing to Kaaba (21.4225°N, 39.8262°E)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with <span style="color: #ef4444;">❤</span> for the Ummah
</p>
