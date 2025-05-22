/** @type {import('next').NextConfig} */
import withSerwistInit from "@serwist/next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [
    {
      url: "/offline",
      revision:  `${Date.now()}__${Math.floor(Math.random() * 100000)}`,
    },
  ],
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(
  withNextIntl({
    reactStrictMode: false,
    experimental: {
      instrumentationHook: true,
    },
  })
);
