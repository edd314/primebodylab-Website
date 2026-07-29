import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // Next optimises images on first request, so the first hit on an image-heavy
  // page is genuinely slow on a cold cache. 30s is too tight for that.
  timeout: 60_000,
  use: {baseURL: 'http://localhost:3000'},
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
