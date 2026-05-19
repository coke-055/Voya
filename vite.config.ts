import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"
import { homedir } from "os"
import type { Plugin, Connect } from "vite"
import type { IncomingMessage, ServerResponse } from "http"

// ── Local file path for trip data (shared with Electron widget) ───────────────
const TRIPS_DIR  = join(homedir(), ".voya")
const TRIPS_FILE = join(TRIPS_DIR, "trips.json")

function tripsApiPlugin(): Plugin {
  return {
    name: "voya-trips-api",
    configureServer(server) {
      server.middlewares.use(
        "/api/trips",
        (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader("Access-Control-Allow-Origin", "*")
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
          res.setHeader("Access-Control-Allow-Headers", "Content-Type")

          if (req.method === "OPTIONS") {
            res.statusCode = 204
            res.end()
            return
          }

          if (req.method === "GET") {
            res.setHeader("Content-Type", "application/json")
            try {
              res.end(readFileSync(TRIPS_FILE, "utf-8"))
            } catch {
              res.end("[]")
            }
            return
          }

          if (req.method === "POST") {
            let body = ""
            req.on("data", (chunk: Buffer) => { body += chunk.toString() })
            req.on("end", () => {
              try {
                if (!existsSync(TRIPS_DIR)) mkdirSync(TRIPS_DIR, { recursive: true })
                writeFileSync(TRIPS_FILE, body, "utf-8")
                res.statusCode = 200
                res.end("ok")
              } catch {
                res.statusCode = 500
                res.end("error")
              }
            })
            return
          }

          res.statusCode = 405
          res.end()
        }
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), tripsApiPlugin()],
  server: {
    port: 5175,
    strictPort: true,
    host: "0.0.0.0",
    proxy: {
      "/api/aviationstack": {
        target: "http://api.aviationstack.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/aviationstack/, "/v1"),
      },
    },
  },
  optimizeDeps: {
    exclude: ["pdfjs-dist"],
  },
})
