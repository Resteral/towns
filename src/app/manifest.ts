import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Oasis Courier | Driver App',
    short_name: 'Driver App',
    description: 'Real-Time Food Delivery Dispatch, Live GPS Telemetry & Shift Console for Sean Martin and couriers.',
    start_url: '/driver',
    display: 'standalone',
    background_color: '#070709',
    theme_color: '#070709',
    orientation: 'portrait',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    shortcuts: [
      {
        name: 'Open Driver Console',
        short_name: 'Console',
        description: 'Open in-vehicle delivery driver HUD',
        url: '/driver',
      },
      {
        name: 'Shift Earnings',
        short_name: 'Earnings',
        description: 'View current shift delivery balance and tips',
        url: '/driver?tab=earnings',
      },
      {
        name: 'Oasis Eats Menu',
        short_name: 'Menu',
        description: 'Browse local restaurant & store menu',
        url: '/eats',
      },
    ],
  };
}
