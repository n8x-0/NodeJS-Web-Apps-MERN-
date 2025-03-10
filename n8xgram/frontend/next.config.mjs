/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
                port: '',
                pathname: '/1200x/2c/47/d5/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/**`,
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'vod.api.video',
                port: '',
                pathname: `/vod/**`,
                search: '',
            },
        ],
    },
};

export default nextConfig;
