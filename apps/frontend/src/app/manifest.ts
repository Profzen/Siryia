import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Siryia - Le Hub Africain',
    short_name: 'Siryia',
    description: 'Le Hub Africain du Commerce et des Services',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#17519B',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // Idéalement, vous ajouterez plus tard des icônes 192x192 et 512x512
      // {
      //   src: '/icon-192x192.png',
      //   sizes: '192x192',
      //   type: 'image/png',
      // },
      // {
      //   src: '/icon-512x512.png',
      //   sizes: '512x512',
      //   type: 'image/png',
      // },
    ],
  }
}
