// main.ts — the entrypoint the grader runs (Node 22, standard library only).
// It copies the game and its screenshots into the output directory and
// writes dossier.json there with the kit's buildDossier.
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, "game"), join(outDir, "game"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots")))
  cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), { recursive: true });
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
