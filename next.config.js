/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins')
const withSvgr = require('next-svgr')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const redirects = require('./redirects')

const nextConfiguration = {
  experimental: {
    // scrollRestoration: true
  },
  reactStrictMode: true,
  env: {
    SANITY_PROJECT_DATASET: process.env.SANITY_PROJECT_DATASET,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID
  },
  redirects,
  async headers () {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=9999999999, must-revalidate' }
        ]
      },
      {
        source: '/img/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=300000, must-revalidate' }
        ]
      }
    ]
  },
  async rewrites () {
    return [
      {
        source: '/__/auth/:path*',
        destination: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROXY + '/__/auth/:path*'
      }
    ]
  },
  onDemandEntries:
    process.env.NODE_ENV === 'development'
      ? {
          // period (in ms) where the server will keep pages in the buffer
          maxInactiveAge: 60 * 60 * 1000, // 1 Hour
          // number of pages that should be kept simultaneously without being disposed
          pagesBufferLength: 8
        }
      : null,
  webpack: config => {
    // Add the .txt files loading as strings
    config.module.rules.push({
      test: /\.txt$/i,
      loader: 'raw-loader'
    })
    return config
  }
}

module.exports = withPlugins([withSvgr, withBundleAnalyzer], nextConfiguration)
