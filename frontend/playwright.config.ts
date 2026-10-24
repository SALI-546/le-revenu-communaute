import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { defineConfig, devices } from '@playwright/test';

// Reads only the demo password so the backend secrets never leak into the Next server env.
process.env.E2E_PASSWORD ??= parseEnv(
  readFileSync('../backend/.env', 'utf8'),
).SEED_USER_PASSWORD;

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: [
    {
      name: 'Strapi',
      command: 'npm run develop',
      cwd: '../backend',
      url: 'http://localhost:1337/_health',
      timeout: 180_000,
      reuseExistingServer: true,
    },
    {
      name: 'Next',
      command: 'npm run build && npm run start',
      url: 'http://localhost:3000/fr',
      timeout: 300_000,
      reuseExistingServer: true,
    },
  ],
});
