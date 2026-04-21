import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.js'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/lodash')) return 'vendor-lodash';
                    if (id.includes('node_modules/@fullcalendar')) return 'vendor-fullcalendar';
                    if (id.includes('node_modules/@vuepic/vue-datepicker')) return 'vendor-datepicker';
                    if (id.includes('node_modules/sweetalert2')) return 'vendor-sweetalert2';
                    if (id.includes('node_modules/datatables')) return 'vendor-datatables';
                    if (id.includes('node_modules/filepond')) return 'vendor-filepond';
                    if (id.includes('node_modules/bootstrap')) return 'vendor-bootstrap';
                },
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
            },
        },
    },
});
