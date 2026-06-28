import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['listing-*.js'],
    environment: 'jsdom',
  },
})
