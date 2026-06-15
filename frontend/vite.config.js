import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    build: {
        assetsDir: "static",
    },

    server: {
        port: 5173,

        proxy: {
           "/api": "http://localhost:3000",
           "/assets": "http://localhost:3000"
        },
    }
})

