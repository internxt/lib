import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['node_modules', 'dist'],
    include: [
      'src/**/*.test.{ts,tsx,js,jsx}',
      'test/**/*.test.{ts,tsx,js,jsx}',
    ],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov'],
      include: [
        'src/**/*.{js,ts,jsx,tsx}',
        'test/**/*.{js,ts,jsx,tsx}'
      ],
      exclude: [
        ...coverageConfigDefaults.exclude
      ]
    },
  },
});
