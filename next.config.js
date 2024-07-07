/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            // proxyを設定して、NEXT_PUBLIC_API_URLから通信しているかのように見せる
            // これにより、SameSite=laxのcookieが使える
            source: '/api/:path*',
            destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
          },
        ]
      : []
  },
  images: {
    remotePatterns: [{ hostname: 'example.com' }, { hostname: 'anotherexample.com' }],
  },
}

module.exports = nextConfig
