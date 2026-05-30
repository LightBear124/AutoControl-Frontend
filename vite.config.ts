import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isPagesBuild = mode === 'pages';

  const base = isPagesBuild
    ? '/AutoControl-Frontend/'
    : '/';

  return {
    base,

    plugins: [
      react(),

      VitePWA({
        registerType: 'autoUpdate',

        devOptions: {
          enabled: true,
        },

        includeAssets: [
          'icon-192.png',
          'icon-512.png',
        ],

        manifest: {
          id: base,

          name: 'Система автоматического паспортного контроля',
          short_name: 'Паспортный контроль',

          description:
            'Просмотр терминалов, рейсов и пассажиров в системе пограничного контроля.',

          theme_color: '#0f4aa3',
          background_color: '#eef3f9',

          display: 'standalone',

          start_url: base,
          scope: base,

          icons: [
            {
              src: `${base}icon-192.png`,
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: `${base}icon-512.png`,
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: `${base}icon-512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },

        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        },
      }),
    ],

    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },

        '/media': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },

    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
  };
});