/**
 * ==============================================================================
 * Hostinger Production Node.js Server Entry (app.js)
 * Excellent Event Planner / Royal Marquee
 * ==============================================================================
 * This entry point allows running the application on Hostinger Node.js Application
 * Manager, Hostinger VPS, cPanel, or any Node.js hosting platform.
 */

import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverBundle = resolve(__dirname, ".output/server/index.mjs");

if (!existsSync(serverBundle)) {
  console.error(
    "\n❌ Error: Production build not found at .output/server/index.mjs\n" +
      "👉 Please run the build command first: npm run build:hostinger (or npm run build)\n"
  );
  process.exit(1);
}

// Set default host and port if not already defined in environment
process.env.HOST = process.env.HOST || "0.0.0.0";
process.env.PORT = process.env.PORT || process.env.NODE_PORT || "3000";

console.log(`\n🚀 Launching Excellent Event Planner on port ${process.env.PORT}...`);

// Dynamically import and run the compiled Nitro server (using pathToFileURL for cross-platform compatibility)
await import(pathToFileURL(serverBundle).href);
