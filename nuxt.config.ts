// https://nuxt.com/docs/api/configuration/nuxt-config
import {defineNuxtConfig} from "nuxt/config";

export default defineNuxtConfig({
    devtools: {enabled: false},
    modules: ["@nuxtjs/strapi", "@nuxt/ui", "@nuxtjs/eslint-module", "@nuxtjs/color-mode"],
    colorMode: {
        preference: "light",
    },
    runtimeConfig: {
        strapi: {
            url: 'http://localhost:5555'
        }
    }
})