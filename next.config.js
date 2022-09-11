/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "ipfs.io",
      "coolmining.io",
      "vignette.wikia.nocookie.net",
      "gateway.pinata.cloud",
      "distant.mypinata.cloud",
      "ipfsfiles.distant.finance",
    ],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
