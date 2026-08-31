import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { ZipArchive } = require("archiver");

console.log("\n=======================================================");
console.log("Building and packaging for Hostinger...");
console.log("=======================================================\n");

// 1. Build the application for Node.js server preset
console.log("Running production build with node-server preset...");
process.env.NITRO_PRESET = "node-server";
execSync("npx vite build", { stdio: "inherit", env: process.env });

function createZip(outputPath, fileList, dirList) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = new ZipArchive({
      zlib: { level: 9 },
      forceLocalTime: true,
    });

    output.on("close", () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`Created ${path.basename(outputPath)} (${sizeMB} MB, ${archive.pointer()} bytes)`);
      resolve();
    });

    archive.on("error", (err) => reject(err));
    archive.pipe(output);

    // Add individual files with 0644 permissions
    for (const f of fileList) {
      if (fs.existsSync(f)) {
        archive.file(f, {
          name: f,
          mode: 0o644,
        });
      }
    }

    // Add directories with explicit 0755 permissions for folders, 0644 for files
    for (const d of dirList) {
      if (fs.existsSync(d.src)) {
        archive.directory(d.src, d.dest === false ? false : (d.dest || d.src), (entry) => {
          const isDir =
            (entry.stats && typeof entry.stats.isDirectory === "function" && entry.stats.isDirectory()) ||
            entry.type === "directory" ||
            entry.name.endsWith("/");
          entry.mode = isDir ? 0o755 : 0o644;
          return entry;
        });
      }
    }

    archive.finalize();
  });
}

function ensureStaticHtml() {
  const assetsDir = path.resolve(".output/public/assets");
  if (!fs.existsSync(assetsDir)) return;
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find((f) => f.endsWith(".css"));
  const clientJs = files.find((f) => f.startsWith("client-") && f.endsWith(".js"));

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Excellent Event Planner — Luxury Wedding & Event Venue in Taxila | Rawalpindi</title>
    <meta name="description" content="Excellent Event Planner is a premium wedding and event venue on Main G-T Road, Faisal Hills, Taxila. Host weddings, walima, mehndi and corporate events with elegant décor and royal catering." />
    <link rel="icon" type="image/png" href="/favicon.png" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@200;300;400;500&display=swap" />
  </head>
  <body class="bg-background text-foreground">
    <div id="root"></div>
    ${clientJs ? `<script type="module" src="/assets/${clientJs}"></script>` : ""}
  </body>
</html>
`;

  fs.writeFileSync(".output/public/index.html", htmlContent, "utf8");
  fs.writeFileSync(".output/public/200.html", htmlContent, "utf8");
  fs.writeFileSync(".output/public/404.html", htmlContent, "utf8");
  console.log("Generated .output/public/index.html, 200.html, and 404.html for static Apache/LiteSpeed hosting!");
}

async function main() {
  ensureStaticHtml();

  // 1. hostinger-deploy.zip (Prebuilt Node.js bundle - No build required on Hostinger!)
  console.log("\nPackaging hostinger-deploy.zip (Prebuilt Node.js bundle)...");
  await createZip(
    "hostinger-deploy.zip",
    ["app.js", "package.json", "package-lock.json", "index.html"],
    [
      { src: ".output", dest: ".output" },
      { src: "public", dest: "public" },
    ]
  );

  // 1b. hostinger-server.zip (Explicit server archive for Hostinger Web App)
  console.log("\nPackaging hostinger-server.zip (Complete Hostinger Node.js Server Package)...");
  await createZip(
    "hostinger-server.zip",
    ["app.js", "package.json", "package-lock.json", "index.html"],
    [
      { src: ".output", dest: ".output" },
      { src: "public", dest: "public" },
    ]
  );

  // 2. hostinger-source.zip (Source bundle with POSIX 0755/0644 permissions for remote Hostinger builders)
  console.log("\nPackaging hostinger-source.zip (Source bundle with Linux POSIX permissions)...");
  await createZip(
    "hostinger-source.zip",
    [
      "app.js",
      "package.json",
      "package-lock.json",
      "index.html",
      "vite.config.ts",
      "tsconfig.json",
      "components.json",
    ],
    [
      { src: "src", dest: "src" },
      { src: "public", dest: "public" },
      { src: "supabase", dest: "supabase" },
    ]
  );

  // 3. hostinger-static.zip (Static files only - for standard public_html drag-and-drop)
  console.log("\nPackaging hostinger-static.zip (Static website for direct public_html)...");
  await createZip(
    "hostinger-static.zip",
    [],
    [{ src: ".output/public", dest: false }]
  );

  console.log("\n=======================================================");
  console.log("ALL HOSTINGER PACKAGES READY!");
  console.log("=======================================================\n");
}

main().catch((err) => {
  console.error("Packaging error:", err);
  process.exit(1);
});
