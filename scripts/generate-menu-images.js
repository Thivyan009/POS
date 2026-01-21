// Generate realistic menu item images using OpenAI Images API
//
// Usage:
//  1) Ensure OPENAI_API_KEY is set (we auto-load .env.local if present)
//  2) Run:
//     - npm run menu:images
//     - node scripts/generate-menu-images.js --only "biryani|koththu"
//     - node scripts/generate-menu-images.js --force
//     - node scripts/generate-menu-images.js --image-model dall-e-3
//
// Models:
//  - Default: dall-e-3 (no verification required, best quality)
//  - Fallback: dall-e-2 (if dall-e-3 fails)
//  - Advanced: gpt-image-1 or gpt-image-1.5 (requires org verification)
//
// Output:
//  - Images saved under: public/menu/photos/<fileName>

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import OpenAI from "openai"
import dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadEnv() {
  // Try common Next.js env files (non-fatal)
  const candidates = [
    path.join(__dirname, "..", ".env.local"),
    path.join(__dirname, "..", ".env"),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) dotenv.config({ path: p })
  }
}

function parseArgs(argv) {
  const args = {
    force: false,
    only: null, // RegExp | null
    limit: Infinity,
    enhance: true,
    promptModel: "gpt-5",
    imageModel: "dall-e-3", // Default to DALL-E 3 (no verification required)
    quality: "sd", // "sd" | "hd" (mapped per model)
  }

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--force") args.force = true
    else if (a === "--only") {
      const raw = argv[i + 1]
      if (!raw) throw new Error("--only requires a value (regex string)")
      args.only = new RegExp(raw, "i")
      i++
    } else if (a === "--limit") {
      const raw = argv[i + 1]
      if (!raw) throw new Error("--limit requires a number")
      args.limit = Number(raw)
      if (!Number.isFinite(args.limit) || args.limit <= 0) {
        throw new Error("--limit must be a positive number")
      }
      i++
    } else if (a === "--no-enhance") {
      args.enhance = false
    } else if (a === "--prompt-model") {
      const raw = argv[i + 1]
      if (!raw) throw new Error("--prompt-model requires a value (e.g. gpt-5)")
      args.promptModel = raw
      i++
    } else if (a === "--image-model") {
      const raw = argv[i + 1]
      if (!raw) throw new Error("--image-model requires a value (e.g. gpt-image-1.5)")
      args.imageModel = raw
      i++
    } else if (a === "--quality") {
      const raw = argv[i + 1]
      if (!raw) throw new Error("--quality requires a value: sd | hd")
      const q = String(raw).toLowerCase()
      if (q !== "sd" && q !== "hd") throw new Error("--quality must be: sd | hd")
      args.quality = q
      i++
    }
  }

  return args
}

function buildUltraRealisticPrompt(userPrompt) {
  // Make outputs consistent and more photorealistic.
  // Also discourages common AI artifacts.
  return [
    "Ultra-realistic professional food photography.",
    "Shot with a full-frame DSLR, 50mm lens, f/2.8, shallow depth of field.",
    "Soft natural window light + subtle fill, realistic shadows, true-to-life colors, high dynamic range.",
    "Restaurant plating on a clean table, minimal props, appetizing, slight natural imperfections.",
    "No text, no watermark, no logo, no labels, no cartoons, no illustration, no CGI, no 3D render.",
    userPrompt.trim(),
  ].join(" ")
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms))
}

async function enhancePromptWithGpt({ client, model, dishName, basePrompt }) {
  // Returns a single improved prompt string.
  const input = [
    {
      role: "system",
      content:
        "You are an expert food photographer and stylist. Rewrite prompts for image generation so they produce ultra-realistic restaurant food photos. Output ONLY the final prompt text (no quotes, no bullet points, no extra commentary). Avoid brand names.",
    },
    {
      role: "user",
      content: `Dish name: ${dishName}\nBase prompt:\n${basePrompt}\n\nRewrite to maximize photorealism: include plating details, lighting, camera angle, lens/camera settings, environment, and food-specific realism cues. Also add negatives like: no text, no watermark, no logo, no illustration, no CGI, no 3D render.`,
    },
  ]

  const resp = await client.responses.create({
    model,
    input,
  })

  const out = (resp.output_text || "").trim()
  return out.length ? out : basePrompt
}

async function main() {
  loadEnv()
  const args = parseArgs(process.argv.slice(2))

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

  const filtered = prompts
    .filter((p) => (args.only ? args.only.test(p.name) || args.only.test(p.fileName) : true))
    .slice(0, args.limit)

  console.log(`Generating ${filtered.length} images into ${outDir} ...`)

  for (const entry of filtered) {
    const outPath = path.join(outDir, entry.fileName)
    if (!args.force && fs.existsSync(outPath)) {
      console.log(`Skipping ${entry.name} (already exists)`)
      continue
    }

    console.log(`Generating image for: ${entry.name}`)
    try {
      let basePrompt = entry.prompt
      if (args.enhance) {
        try {
          basePrompt = await enhancePromptWithGpt({
            client,
            model: args.promptModel,
            dishName: entry.name,
            basePrompt: entry.prompt,
          })
        } catch (e) {
          console.warn(
            `Prompt enhancement failed for ${entry.name}; using original prompt.`,
            e?.message || e,
          )
        }
      }

      const prompt = buildUltraRealisticPrompt(basePrompt)

      // Simple retry with fallback models (rate limits / verification errors)
      let img
      const modelsToTry = [args.imageModel, "dall-e-3", "dall-e-2"]
      let lastError = null

      for (const model of modelsToTry) {
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const params = {
              model,
              prompt,
              n: 1,
            }

            // DALL-E 3 specific parameters
            if (model === "dall-e-3") {
              params.size = "1024x1024"
              params.quality = args.quality === "hd" ? "hd" : "standard" // "standard" or "hd"
            } else if (model === "dall-e-2") {
              params.size = "1024x1024"
            } else {
              // gpt-image-1 or gpt-image-1.5
              params.size = "1024x1024"
              // gpt-image models use: low | medium | high
              params.quality = args.quality === "hd" ? "high" : "medium"
            }

            img = await client.images.generate(params)
            break
          } catch (e) {
            lastError = e
            const isVerificationError =
              e?.message?.includes("organization must be verified") ||
              e?.message?.includes("403") ||
              e?.status === 403

            if (isVerificationError && model !== modelsToTry[modelsToTry.length - 1]) {
              console.warn(
                `Model ${model} requires verification. Trying fallback model...`,
              )
              await sleep(500)
              break // Try next model
            }

            if (attempt === 3 && model === modelsToTry[modelsToTry.length - 1]) {
              throw e // Last model, last attempt
            }

            if (attempt < 3) {
              const backoff = 750 * attempt
              console.warn(
                `Retrying ${entry.name} with ${model} (attempt ${attempt}/3) in ${backoff}ms...`,
              )
              await sleep(backoff)
            }
          }
        }

        if (img) break // Success, exit model loop
      }

      if (!img) {
        throw lastError || new Error("Failed to generate image with any model")
      }

      // Handle different response formats
      let imageUrl = null
      let b64 = null

      if (img.data && img.data[0]) {
        imageUrl = img.data[0].url
        b64 = img.data[0].b64_json
      }

      if (b64) {
        // Base64 response
        const buffer = Buffer.from(b64, "base64")
        fs.writeFileSync(outPath, buffer)
        console.log(`Saved: ${outPath}`)
      } else if (imageUrl) {
        // URL response (DALL-E 3 returns URLs)
        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error(`Failed to download image: ${response.statusText}`)
        }
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        fs.writeFileSync(outPath, buffer)
        console.log(`Saved: ${outPath}`)
      } else {
        console.error(`No image data returned for ${entry.name}`)
        continue
      }
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






