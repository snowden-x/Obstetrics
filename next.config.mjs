import withPWA from 'next-pwa';

const nextConfig = {
    reactStrictMode: true,
};

export default withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    buildExcludes: [/middleware-manifest\.json$/],
    publicExcludes: ['!**/*'],
    cacheOnFrontEndNav: true,
    reloadOnOnline: false,
    sw: '/sw.js',
})(nextConfig);