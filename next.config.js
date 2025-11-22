/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        // Disable caching entirely for Webpack
        config.cache = false;

        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.(".svg")
        );
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            'pg-hstore': false, 'pg': false,
            'sqlite3': false, 'better-sqlite3': false,
            'mariadb': false, 'tedious': false, 'oracledb': false,
        };

        config.module.rules.push(
            // Reapply the existing rule, but only for svg imports ending in ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: ["@svgr/webpack"],
            }
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.lorem.space",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "a0.muscache.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "http", // Add this line for localhost
                hostname: "localhost",
            },
        ],
    },
};

module.exports = nextConfig;
