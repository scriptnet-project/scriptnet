import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', workers: 1, timeout: 60000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { trace: 'off', screenshot: 'off', video: 'off' },
});
