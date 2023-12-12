// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: false},
    modules: ["@nuxtjs/strapi"],
    runtimeConfig: {
        strapi: {
            url: 'http://localhost:5555'
        },
        public: {
            strapi: {
                url: 'http://localhost:5555'
            }
        }
    }
})
