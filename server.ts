import express from "express";
import path from "path";
import cors from "cors";
import "dotenv/config";

// Import routes
import authRoutes from "./src/server/routes/auth.js";
import productRoutes from "./src/server/routes/products.js";
import requestRoutes from "./src/server/routes/requests.js";
import settingsRoutes from "./src/server/routes/settings.js";
import { seedDatabase } from "./src/server/utils/seed.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/settings", settingsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function setupViteAndStart() {
  // Seed Supabase (only in local/Render, skip on Vercel cold starts to save DB connections)
  if (process.env.VERCEL !== "1") {
    try {
      await seedDatabase();
    } catch (error) {
      console.error("Seed error:", error);
    }
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (process.env.VERCEL !== "1") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Only serve index.html for non-API routes
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only listen to the port if we are NOT on Vercel
  // Vercel manages the server automatically via the export below
  if (process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

if (process.env.VERCEL !== "1") {
  setupViteAndStart();
}

// Export the app so Vercel's Serverless Functions can use it
export default app;
