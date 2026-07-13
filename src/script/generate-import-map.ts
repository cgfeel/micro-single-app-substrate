#!/usr/bin/env node

/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve(process.cwd(), "dist");
const MICRO_DIR = path.join(DIST_DIR, "micro");

const ROOT_CONFIG_URL = process.env.DEPLOY_BASE ?? "/micro-single-app-substrate";
const MICRO_BASE_URL = `${ROOT_CONFIG_URL}/micro`;

const imports: Record<string, string> = {
  "@levi/root-config": `${ROOT_CONFIG_URL}/levi-root-config.js`,
};

const isImportMapManifest = (data: unknown): data is ImportMapManifest => {
  if (typeof data !== "object" || data === null) return false;
  const map = data as Record<string, unknown>;
  return typeof map.name === "string" && typeof map.file === "string";
};

if (!fs.existsSync(MICRO_DIR)) {
  console.error(`Directory not found: ${MICRO_DIR}`);
  process.exit(1);
}

for (const entry of fs.readdirSync(MICRO_DIR, {withFileTypes: true})) {
  if (!entry.isDirectory()) continue;

  const appDir = path.join(MICRO_DIR, entry.name);
  const importMapFile = path.join(appDir, "import-map.json");

  try {
    if (!fs.existsSync(importMapFile)) continue;
    const info = JSON.parse(fs.readFileSync(importMapFile, "utf-8")) as unknown;
    const {file, name} = isImportMapManifest(info) ? info : {};

    if (file && name) {
      imports[name] = `${MICRO_BASE_URL}/${entry.name}/${file}`;
    }
  } catch (err) {
    console.warn(`Failed to read ${importMapFile}:`, err);
  }
}

const output = {imports};
const outputFile = path.join(DIST_DIR, "import-map.json");

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2) + "\n");

console.log(`✔ Generated ${path.relative(process.cwd(), outputFile)}`, output);

type ImportMapManifest = {
  file: string;
  name: string;
};
