module.exports = {
  images: {
    domains: ['res.cloudinary.com'], 
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next', 'C:/DumpStack.log.tmp', 'C:/hiberfil.sys', 'C:/swapfile.sys', 'C:/pagefile.sys']
      }
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value:'nosniff',
          },

          {
            key: 'X-XSS-Protection',
            value:'1; mode=block',
          },

          {
            key: 'Content-Security-Policy',
            value:"frame-ancestors 'self' https://app.contentful.com",
          },
         ],
      },
    ]
  }, 

  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false,
      },
    
       ];
  },
};