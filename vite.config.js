import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { resolve } from 'path'

const outDir = resolve(__dirname, 'dist')
const html = 'index.html';

export default defineConfig({
    build: {
        outDir,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, html),
                dashboard: resolve(__dirname, 'dashboard/index.html'),
                password_reset: resolve(__dirname, 'password_reset/index.html'),
                signup: resolve(__dirname, 'signup/index.html')
            },
        },
    },
    plugins: [tailwindcss(), svelte()],
})