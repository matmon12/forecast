// vite.config.js
import { ViteImageOptimizer } from "file:///C:/gitPages/forecast/node_modules/vite-plugin-image-optimizer/dist/index.mjs";
import { defineConfig } from "file:///C:/gitPages/forecast/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "node:url";
import vue from "file:///C:/gitPages/forecast/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Icons from "file:///C:/gitPages/forecast/node_modules/unplugin-icons/dist/vite.js";
import Components from "file:///C:/gitPages/forecast/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///C:/gitPages/forecast/node_modules/unplugin-auto-import/dist/vite.js";
import IconsResolver from "file:///C:/gitPages/forecast/node_modules/unplugin-icons/dist/resolver.js";
import { PrimeVueResolver } from "file:///C:/gitPages/forecast/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_import_meta_url = "file:///C:/gitPages/forecast/vite.config.js";
var vite_config_default = defineConfig({
  base: "/forecast/",
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
                removeViewBox: false
                // https://github.com/svg/svgo/issues/1128
              },
              cleanupIDs: {
                minify: false,
                remove: false
              },
              convertPathData: false
            }
          },
          "sortAttrs",
          {
            name: "addAttributesToSVGElement",
            params: {
              attributes: [{ xmlns: "http://www.w3.org/2000/svg" }]
            }
          }
        ]
      },
      png: {
        quality: 100
      },
      jpeg: {
        quality: 100
      },
      jpg: {
        quality: 100
      },
      webp: {
        lossless: true
      }
    }),
    Components({ resolvers: [IconsResolver(), PrimeVueResolver()] }),
    Icons({
      /* options */
    }),
    AutoImport({
      /* options */
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/style/var.scss"; @import "@/style/adaptive.scss";`
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxnaXRQYWdlc1xcXFxmb3JlY2FzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcZ2l0UGFnZXNcXFxcZm9yZWNhc3RcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L2dpdFBhZ2VzL2ZvcmVjYXN0L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgVml0ZUltYWdlT3B0aW1pemVyIH0gZnJvbSBcInZpdGUtcGx1Z2luLWltYWdlLW9wdGltaXplclwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gXCJub2RlOnVybFwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgSWNvbnMgZnJvbSBcInVucGx1Z2luLWljb25zL3ZpdGVcIjtcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xuaW1wb3J0IEljb25zUmVzb2x2ZXIgZnJvbSBcInVucGx1Z2luLWljb25zL3Jlc29sdmVyXCI7XG5pbXBvcnQgeyBQcmltZVZ1ZVJlc29sdmVyIH0gZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVyc1wiO1xuXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiBcIi9mb3JlY2FzdC9cIixcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIFZpdGVJbWFnZU9wdGltaXplcih7XG4gICAgICBzdmc6IHtcbiAgICAgICAgbXVsdGlwYXNzOiB0cnVlLFxuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJwcmVzZXQtZGVmYXVsdFwiLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgIG92ZXJyaWRlczoge1xuICAgICAgICAgICAgICAgIGNsZWFudXBOdW1lcmljVmFsdWVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZW1vdmVWaWV3Qm94OiBmYWxzZSwgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N2Zy9zdmdvL2lzc3Vlcy8xMTI4XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNsZWFudXBJRHM6IHtcbiAgICAgICAgICAgICAgICBtaW5pZnk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlbW92ZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNvbnZlcnRQYXRoRGF0YTogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzb3J0QXR0cnNcIixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcImFkZEF0dHJpYnV0ZXNUb1NWR0VsZW1lbnRcIixcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBbeyB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIH1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHBuZzoge1xuICAgICAgICBxdWFsaXR5OiAxMDAsXG4gICAgICB9LFxuICAgICAganBlZzoge1xuICAgICAgICBxdWFsaXR5OiAxMDAsXG4gICAgICB9LFxuICAgICAganBnOiB7XG4gICAgICAgIHF1YWxpdHk6IDEwMCxcbiAgICAgIH0sXG4gICAgICB3ZWJwOiB7XG4gICAgICAgIGxvc3NsZXNzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHsgcmVzb2x2ZXJzOiBbSWNvbnNSZXNvbHZlcigpLCBQcmltZVZ1ZVJlc29sdmVyKCldIH0pLFxuICAgIEljb25zKHtcbiAgICAgIC8qIG9wdGlvbnMgKi9cbiAgICB9KSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIC8qIG9wdGlvbnMgKi9cbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgc2Nzczoge1xuICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJAL3N0eWxlL3Zhci5zY3NzXCI7IEBpbXBvcnQgXCJAL3N0eWxlL2FkYXB0aXZlLnNjc3NcIjtgLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9QLFNBQVMsMEJBQTBCO0FBQ3ZSLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsZUFBZSxXQUFXO0FBQ25DLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyx3QkFBd0I7QUFSb0gsSUFBTSwyQ0FBMkM7QUFZdE0sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osbUJBQW1CO0FBQUEsTUFDakIsS0FBSztBQUFBLFFBQ0gsV0FBVztBQUFBLFFBQ1gsU0FBUztBQUFBLFVBQ1A7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLFFBQVE7QUFBQSxjQUNOLFdBQVc7QUFBQSxnQkFDVCxzQkFBc0I7QUFBQSxnQkFDdEIsZUFBZTtBQUFBO0FBQUEsY0FDakI7QUFBQSxjQUNBLFlBQVk7QUFBQSxnQkFDVixRQUFRO0FBQUEsZ0JBQ1IsUUFBUTtBQUFBLGNBQ1Y7QUFBQSxjQUNBLGlCQUFpQjtBQUFBLFlBQ25CO0FBQUEsVUFDRjtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixRQUFRO0FBQUEsY0FDTixZQUFZLENBQUMsRUFBRSxPQUFPLDZCQUE2QixDQUFDO0FBQUEsWUFDdEQ7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxRQUNILFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQSxNQUFNO0FBQUEsUUFDSixTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsS0FBSztBQUFBLFFBQ0gsU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNKLFVBQVU7QUFBQSxNQUNaO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxXQUFXLEVBQUUsV0FBVyxDQUFDLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUM7QUFBQSxJQUMvRCxNQUFNO0FBQUE7QUFBQSxJQUVOLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQTtBQUFBLElBRVgsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
