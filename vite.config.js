import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: './',
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler', // Use the modern Sass API
            },
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    mantine: ['@mantine/core', '@mantine/hooks', '@mantine/notifications'],
                },
            },
        },
    },
    server: {
        port: 3000,
        host: true,
    },
    optimizeDeps: {
        include: ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
    },
});
