/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mdxeditor/editor"],
  // webpack: (config) => {
  //   // this will override the experiments
  //   config.experiments = { ...config.experiments, topLevelAwait: true };
  //   // this will just update topLevelAwait property of config.experiments
  //   // config.experiments.topLevelAwait = true
  //   return config;
  // },

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  // add hostname
  images: {
    domains: [
      "localhost",
      "lh3.googleusercontent.com",
      "picsum.photos",
      "unsplash.com",
      "images.unsplash.com",
      "images.pexels.com",
      "cdn.pixabay.com",
      "cdn.discordapp.com",
    ],
  },
};

// export default nextConfig;
export default nextConfig;
