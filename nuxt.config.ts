// https://nuxt.com/docs/api/configuration/nuxt-config
import {defineNuxtConfig} from "nuxt/config"

export default defineNuxtConfig({
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
        }
    },
    devtools: {enabled: false},
    modules: ["@nuxtjs/strapi", "@nuxt/ui", "@nuxtjs/eslint-module", "@nuxtjs/color-mode", "@pinia/nuxt"],
    colorMode: {
        preference: "light",
    },
    strapi: {
        url: "http://localhost:5555"
    },
    plugins: ["~/plugins/chart.client.ts"]
})