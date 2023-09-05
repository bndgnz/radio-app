module.exports = {
  
  images: {
    domains: ['res.cloudinary.com'], 
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:"frame-ancestors 'https://app.contentful.com'",
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