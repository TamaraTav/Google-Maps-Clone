const fs = require("fs")
const path = require("path")

const envPath = path.join(__dirname, ".env")

if (!fs.existsSync(envPath)) {
  console.error(".env file not found. Please create .env with MAPBOX_ACCESS_TOKEN.")
  process.exit(1)
}

const rawEnv = fs.readFileSync(envPath, "utf-8")

const lines = rawEnv
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))

let token = ""

for (const line of lines) {
  if (line.startsWith("MAPBOX_ACCESS_TOKEN=")) {
    token = line.slice("MAPBOX_ACCESS_TOKEN=".length).trim()
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      token = token.slice(1, -1)
    }
    break
  }
}

if (!token) {
  console.error("MAPBOX_ACCESS_TOKEN is not defined in .env")
  process.exit(1)
}

const output = `window.MAPBOX_ACCESS_TOKEN = "${token}";\n`

const outputPath = path.join(__dirname, "env.config.js")
fs.writeFileSync(outputPath, output, "utf-8")

console.log("env.config.js generated successfully.")
