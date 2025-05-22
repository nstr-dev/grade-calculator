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
      revision: "1",
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
