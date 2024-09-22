/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
};

module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     experimental: {
//         serverActions: true,
//     },
//     async headers() {
//         return [
//             {
//                 source: "/(.*)",
//                 headers: [
//                     {
//                         key: "Cross-Origin-Opener-Policy",
//                         value: "same-origin",
//                     },
//                 ],
//             },
//         ];
//     },
// };

// module.exports = nextConfig;
