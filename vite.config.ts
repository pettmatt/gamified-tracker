import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Checker from "vite-plugin-checker"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Checker({ typescript: true }),
        VitePWA({
            injectRegister: null,
            registerType: "autoUpdate",
            devOptions: {
                enabled: true
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
            },
            // https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
            manifest: {
                name: "Gamified tracker",
                short_name: "GT",
                description: "Gamified cardio application.",
                theme_color: "#ffffff"
                // icons: [
                //     {
                //         src: "pwa-192x192.png",
                //         sizes: "192x192",
                //         type: "image/png"
                //     },
                //     {
                //         src: "pwa-512x512.png",
                //         sizes: "512x512",
                //         type: "image/png"
                //     }
                // ]
            }
        })
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
})
