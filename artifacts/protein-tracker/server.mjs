import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const distPath = join(__dirname, "dist", "public");

// Serve static files from the Vite build output
app.use(express.static(distPath));

// SPA fallback — all unmatched routes return index.html
// so that React Router / wouter handles client-side routing
app.get("*", (_req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`ProTracker server running on port ${PORT}`);
});
