/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            provider: 'istanbul'
        },
        globals: true,
        environment: 'jsdom', 
        setupFiles: 'src/config/setupTests.ts',
        includeSource: ['src/**/*.test.ts']
    },
})
