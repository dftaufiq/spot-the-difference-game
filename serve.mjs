// serve.mjs — a tiny static server for playing the game locally.
// Serves game/ on http://localhost:8080. Standard library only.
import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("./game", import.meta.url)));
const port = Number(process.env.PORT || 8080);
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const server = createServer((req, res) => {
  const path = normalize(join(root, decodeURIComponent(req.url.split("?")[0])));
  if (!path.startsWith(root)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  const file = path.endsWith("/") ? join(path, "index.html") : path;
  const stream = createReadStream(file);
  stream.on("open", () => {
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
    stream.pipe(res);
  });
  stream.on("error", () => {
    res.writeHead(404);
    res.end("not found");
  });
});

server.listen(port, () => {
  console.log(`Lanternlight at http://localhost:${port}`);
});
