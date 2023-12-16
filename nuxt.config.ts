// https://nuxt.com/docs/api/configuration/nuxt-config
import {defineNuxtConfig} from "nuxt/config"

export default defineNuxtConfig({
    devtools: {enabled: false},
    modules: ["@nuxtjs/strapi", "@nuxt/ui", "@nuxtjs/eslint-module", "@nuxtjs/color-mode", "@nuxtjs/google-fonts", "@pinia/nuxt"],
    colorMode: {
        preference: "light",
    },
    googleFonts: {
        display: "swap",
        download: true,
        families: {
            "DM+Sans": [400, 500, 600, 700]
        }
    },
    strapi: {
        url: "http://localhost:5555"
    },
    runtimeConfig: {
        strapi: {
            url: 'http://localhost:5555'
        }
    }
})