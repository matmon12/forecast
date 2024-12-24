import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import { PrimeVueResolver } from "unplugin-vue-components/resolvers";
import { dirname, resolve } from "node:path";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/forecast/" : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        error: resolve(__dirname, "404.html"),
      },
    },
  },
  plugins: [
    vue(),
    ViteImageOptimizer({
      svg: {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
              },
              cleanupIDs: {
                minify: false,
                remove: false,
              },
              convertPathData: false,
            },
          },
          "sortAttrs",
          {
            name: "addAttributesToSVGElement",
            params: {
              attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
            },
          },
          VueI18nPlugin({
            include: resolve(
              dirname(fileURLToPath(import.meta.url)),
              "./src/i18n/locales/**"
            ),
          }),
        ],
      },
      png: {
        quality: 100,
      },
      jpeg: {
        quality: 100,
      },
      jpg: {
        quality: 100,
      },
      webp: {
        lossless: true,
      },
    }),
    Components({ resolvers: [IconsResolver(), PrimeVueResolver()] }),
    Icons({
      /* options */
    }),
    AutoImport({
      /* options */
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/style/var.scss"; @import "@/style/_adaptive.scss";`,
      },
    },
  },
});
