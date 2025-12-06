import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'build',
        rollupOptions: {
            input: {
                main: './src/index.jsx',
            },
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
        emptyOutDir: true, // Clean the output directory before each build
    },
    server: {
        port: 5173,
        cors: true,
        strictPort: true,
        hmr: {
            host: 'localhost',
        }
    },
});
