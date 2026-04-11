import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { VitePWA } from "vite-plugin-pwa";
import compression from "vite-plugin-compression2";
// import { visualizer } from "rollup-plugin-visualizer";

import dns from "dns";
import path from "path";

dns.setDefaultResultOrder("verbatim");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const configuredBasePath = env.VITE_APP_BASE_PATH || "/";
  const enableAdminPwa = env.VITE_ENABLE_ADMIN_PWA === "true";
  const basePath = configuredBasePath.endsWith("/")
    ? configuredBasePath
    : `${configuredBasePath}/`;

  return {
    // root: "./", // Set the root directory of your project
    base: basePath,

    build: {
      outDir: "build",
      assetsDir: "assets", // <-- change from "@/assets" to "assets"
      rollupOptions: {},
      chunkSizeWarningLimit: 10 * 1024,
    },
    plugins: [
      react(),
      cssInjectedByJsPlugin(),

      VitePWA({
        disable: !enableAdminPwa,
        registerType: "autoUpdate",
        devOptions: {
          // enabled: process.env.SW_DEV === "true",
          enabled: false,
          /* when using generateSW the PWA plugin will switch to classic */
          type: "module",
          navigateFallback: "index.html",
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        },

      // add this to cache all the
      // // static assets in the public folder
      // includeAssets: ["**/*"],
      includeAssets: [
        "src/assets/img/logo/*.png",
        "src/assets/img/*.png",
        "src/assets/img/*.jepg",
        "src/assets/img/*.webp",
        "favicon.png",
        "favicon.ico",
      ],
        manifest: {
          theme_color: "#FFFFFF",
          background_color: "#FFFFFF",
          display: "standalone",
          orientation: "portrait",
          scope: ".",
          start_url: ".",
          id: ".",
          short_name: "Babys - Admin Dashboard",
          name: "Babys | Best Shop for Moms and Babies - Admin Dashboard",
          description:
            "Babys | Best Shop for Moms and Babies - Admin Dashboard",
          icons: [
            {
              src: "/favicon.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "/icon-256x256.png",
              sizes: "256x256",
              type: "image/png",
            },
            {
              src: "/icon-384x384.png",
              sizes: "384x384",
              type: "image/png",
            },
            {
              src: "/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
      compression(),
      // visualizer({
      //   filename: "statistics.html",
      //   open: true,
      // }),
    ],

    server: {
      proxy: {
        "/api/": {
          target: "http://localhost:5065",
          changeOrigin: true,
        },
      },
    },
    // define: {
    //   "process.env": process.env,
    //   // global: {}, //enable this when running on dev/local mode
    // },

    resolve: {
      alias: {
        // eslint-disable-next-line no-undef
        "@": path.resolve(__dirname, "./src/"),
      },
    },
    test: {
      global: true,
      environment: "jsdom",
      setupFiles: ["./src/setupTest.js"],
    },
  };
});
