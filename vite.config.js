import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: true,
        proxy: {
            "/api/run": {
                target: "http://localhost:8787",
                changeOrigin: true,
                rewrite: function (p) { return p.replace(/^\/api\/run/, "/v1/run"); },
            },
            "/api/chat": {
                target: "http://localhost:8788",
                changeOrigin: true,
                rewrite: function (p) { return p.replace(/^\/api\/chat/, "/v1/chat"); },
            },
        },
    },
});
