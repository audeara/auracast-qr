import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Auracast QR Code Generator',
    short_name: 'Auracast QR',
    description:
      'Generate SIG-compliant Bluetooth Auracast QR codes for venues and assistive listening.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0082fc',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
