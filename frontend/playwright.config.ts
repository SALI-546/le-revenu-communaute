import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { defineConfig, devices } from '@playwright/test';

// Reads only the demo password so the backend secrets never leak into the Next server env.
process.env.E2E_PASSWORD ??= parseEnv(
  readFileSync('../backend/.env', 'utf8'),
).SEED_USER_PASSWORD;

const port = process.env.E2E_PORT ?? '3000';
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  reporter: 'list',
  use: { baseURL, trace: 'retain-on-failure' },
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
      command: `npm run build && npm run start -- -p ${port}`,
      url: `${baseURL}/fr`,
      timeout: 300_000,
      reuseExistingServer: true,
    },
  ],
});
