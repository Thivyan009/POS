// Generate realistic menu item images using OpenAI Images API
// Usage:
//  1) Set OPENAI_API_KEY in your environment
//  2) Run: node scripts/generate-menu-images.js
//
// Images will be saved under: public/menu/photos/<fileName>

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import OpenAI from "openai"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set. Please add it to your environment.")
    process.exit(1)
  }

  const client = new OpenAI({ apiKey })

  const promptsPath = path.join(__dirname, "menu-image-prompts.json")
  const promptsRaw = fs.readFileSync(promptsPath, "utf8")
  const prompts = JSON.parse(promptsRaw)

  const outDir = path.join(__dirname, "..", "public", "menu", "photos")
  fs.mkdirSync(outDir, { recursive: true })

  console.log(`Generating ${prompts.length} images into ${outDir} ...`)

  for (const entry of prompts) {
    const outPath = path.join(outDir, entry.fileName)
    if (fs.existsSync(outPath)) {
      console.log(`Skipping ${entry.name} (already exists)`)
      continue
    }

    console.log(`Generating image for: ${entry.name}`)
    try {
      const img = await client.images.generate({
        model: "gpt-image-1",
        prompt: entry.prompt,
        size: "1024x1024",
        quality: "high",
        n: 1,
      })

      const b64 = img.data[0].b64_json
      if (!b64) {
        console.error(`No image data returned for ${entry.name}`)
        continue
      }

      const buffer = Buffer.from(b64, "base64")
      fs.writeFileSync(outPath, buffer)
      console.log(`Saved: ${outPath}`)
    } catch (err) {
      console.error(`Failed to generate ${entry.name}:`, err?.message || err)
    }
  }

  console.log("Done.")
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})


