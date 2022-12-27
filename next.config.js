module.exports = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/account123/**',
      },
    ],
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