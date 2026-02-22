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
            exclude: ['fabric'], // Don't pre-bundle heavy libs that are lazy loaded
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

        build: {
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
                    passes: 2,
                    ecma: 2020,
                    // Additional compression
                    dead_code: true,
                    collapse_vars: true,
                    reduce_vars: true,
                    hoist_funs: true,
                    toplevel: false,
                },
                mangle: {
                    safari10: true,
                },
                format: {
                    comments: false, // Remove all comments
                    ecma: 2020,
                },
            },

            chunkSizeWarningLimit: 500,
            cssCodeSplit: true,
            sourcemap: false,
            cssMinify: true, // Use default CSS minifier (esbuild)
            target: 'es2020',
            modulePreload: {
                polyfill: false, // Modern browsers support this natively
            },
            // Optimize asset inlining threshold
            assetsInlineLimit: 4096, // Inline assets < 4KB as base64

            rollupOptions: {
                output: {
                    manualChunks(id) {
                        // Core React - always needed
                        if (id.includes('react-dom') || (id.includes('/react/') && !id.includes('react-'))) {
                            return 'vendor-react';
                        }
                        // Router - needed for navigation
                        if (id.includes('react-router')) {
                            return 'vendor-router';
                        }
                        // Redux - state management
                        if (id.includes('react-redux') || id.includes('@reduxjs/toolkit') || id.includes('redux')) {
                            return 'vendor-redux';
                        }
                        // HTTP client
                        if (id.includes('axios')) {
                            return 'vendor-http';
                        }
                        // Heavy libs - lazy loaded, separate chunks
                        if (id.includes('fabric')) {
                            return 'vendor-fabric';
                        }
                        if (id.includes('framer-motion')) {
                            return 'vendor-motion';
                        }
                        if (id.includes('@mui/') || id.includes('@emotion/')) {
                            return 'vendor-mui';
                        }
                        if (id.includes('socket.io-client')) {
                            return 'vendor-socket';
                        }
                        if (id.includes('@sentry/')) {
                            return 'vendor-sentry';
                        }
                        // UI utilities - smaller, group together
                        if (id.includes('react-toastify') || id.includes('react-icons') || id.includes('react-hot-toast')) {
                            return 'vendor-ui';
                        }
                        if (id.includes('react-helmet') || id.includes('react-loading-skeleton') || id.includes('react-lazyload')) {
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
