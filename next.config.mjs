// @ts-nocheck
// Optional overrides: create ./next.user-config.mjs (gitignored) — export default { ... } or an async function (phase, { defaultConfig }) => ({ ... }).

import fs from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import path from 'path'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const userConfigPath = path.join(projectRoot, 'next.user-config.mjs')

export default async function nextConfig(phase, { defaultConfig }) {
  let userConfigImport = {}
  if (fs.existsSync(userConfigPath)) {
    const mod = await import(pathToFileURL(userConfigPath).href)
    userConfigImport = mod.default ?? mod
  }

  const userConfig = typeof userConfigImport === 'function'
    ? await userConfigImport(phase, { defaultConfig })
    : userConfigImport

  return {
    ...userConfig,
    distDir: '.next',
    devIndicators: false,
    images: {
      ...userConfig.images,
      unoptimized: process.env.NODE_ENV === 'development',
    },
    logging: {
      ...userConfig.logging,
      fetches: { fullUrl: true, hmrRefreshes: true },
      browserToTerminal: true,
    },
    turbopack: {
      ...userConfig.turbopack,
      root: projectRoot,
    },
    experimental: {
      ...userConfig.experimental,
      transitionIndicator: true,
      turbopackFileSystemCacheForDev: process.env.TURBOPACK_PERSISTENT_CACHE !== 'false' && process.env.TURBOPACK_PERSISTENT_CACHE !== '0',
      serverActions: {
        ...userConfig.experimental?.serverActions,
        allowedOrigins: [
          ...(userConfig.experimental?.serverActions?.allowedOrigins || []),
        ],
      },
    },
    allowedDevOrigins: [...(userConfig.allowedDevOrigins || [])],
  }
}
