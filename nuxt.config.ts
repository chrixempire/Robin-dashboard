// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    "@/assets/css/reset.css",
    "@/assets/css/root.css",
    "@/assets/css/table.css",
    "@/assets/css/graph.css",
  ],
  modules: ['nuxt-svgo']
})
