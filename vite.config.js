import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    const plugins = [react()];

    if (mode === 'production' && process.env.ANALYZE) {
        plugins.push(
            visualizer({
                filename: './dist/bundle-analysis.html',
                open: true,
                gzipSize: true,
                brotliSize: true,
            })
        );
    }

    return {
        plugins,

        optimizeDeps: {
            include: ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
        },

        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:4000',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },

        // CSS optimization — Tailwind uses PostCSS, so keep default transformer
        // Lightning CSS is used only for minification (cssMinify below)

        build: {
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
                    passes: 3, // extra pass for deeper optimization
                    ecma: 2020,
                    dead_code: true,
                    collapse_vars: true,
                    reduce_vars: true,
                    hoist_funs: true,
                    toplevel: false,
                    // Aggressive unused code removal
                    unused: true,
                    booleans_as_integers: true,
                },
                mangle: {
                    safari10: true,
                    toplevel: false,
                },
                format: {
                    comments: false,
                    ecma: 2020,
                    ascii_only: true,
                },
            },

            chunkSizeWarningLimit: 300, // tighter warning threshold
            cssCodeSplit: true,
            sourcemap: false,
            cssMinify: true, // Use esbuild for CSS minification (compatible with Tailwind)
            target: 'es2020',
            modulePreload: {
                polyfill: false,
            },
            assetsInlineLimit: 4096,

            rollupOptions: {
                output: {
                    manualChunks(id) {
                        // Core React — always needed
                        if (id.includes('react-dom') || (id.includes('/react/') && !id.includes('react-'))) {
                            return 'vendor-react';
                        }
                        // Router — needed for navigation
                        if (id.includes('react-router')) {
                            return 'vendor-router';
                        }
                        // Redux — state management
                        if (id.includes('react-redux') || id.includes('@reduxjs/toolkit') || id.includes('redux')) {
                            return 'vendor-redux';
                        }
                        // HTTP client
                        if (id.includes('axios')) {
                            return 'vendor-http';
                        }
                        // Heavy libs — separate chunks (lazy loaded)
                        if (id.includes('socket.io-client')) {
                            return 'vendor-socket';
                        }
                        if (id.includes('@sentry/')) {
                            return 'vendor-sentry';
                        }
                        // Toast — separate chunk (lazy loaded)
                        if (id.includes('react-toastify')) {
                            return 'vendor-toast';
                        }
                        // Icons — tree-shake, separate chunk
                        if (id.includes('react-icons')) {
                            return 'vendor-icons';
                        }
                        // Helmet
                        if (id.includes('react-helmet')) {
                            return 'vendor-utils';
                        }
                    },

                    assetFileNames: (assetInfo) => {
                        const ext = assetInfo.name.split('.').pop();
                        if (/png|jpe?g|svg|gif|ico|webp|avif/i.test(ext)) {
                            return `assets/images/[name]-[hash][extname]`;
                        }
                        if (/woff2?|eot|ttf|otf/i.test(ext)) {
                            return `assets/fonts/[name]-[hash][extname]`;
                        }
                        return `assets/[name]-[hash][extname]`;
                    },

                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                },
            },
        },
    };
});
