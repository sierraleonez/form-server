/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upcdn.io',
        port: '',
      }
    ]
  }
}

module.exports = nextConfig
