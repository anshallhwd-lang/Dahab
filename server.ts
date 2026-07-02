import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

const PORT = 3000;
const app = express();

// Set up JSON body parser with increased limit to handle base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Ensure data directories exist
const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

// Cache submissions in memory to avoid crashing on read-only environments
let submissionsCache: any[] = [];

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), "utf-8");
  } else {
    const fileData = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    submissionsCache = JSON.parse(fileData);
  }
} catch (e) {
  console.warn("Failed to initialize local filesystem directories. Defaulting to in-memory storage.", e);
}

// Serve uploads directory as static
app.use("/data/uploads", express.static(UPLOADS_DIR));

// Helper function to save base64 file to uploads folder and return relative URL path
function saveBase64File(base64DataUrl: string, originalName: string): string | null {
  try {
    if (!base64DataUrl || !base64DataUrl.includes(";base64,")) return null;
    
    const parts = base64DataUrl.split(";base64,");
    const mimeType = parts[0].split(":")[1];
    const base64Data = parts[1];
    const buffer = Buffer.from(base64Data, "base64");
    
    // Create unique filename
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${sanitizedName}`;
    const filePath = path.join(UPLOADS_DIR, uniqueName);
    
    fs.writeFileSync(filePath, buffer);
    return `/data/uploads/${uniqueName}`;
  } catch (error) {
    console.error("Error saving base64 file to local storage:", error);
    // FALLBACK: If filesystem is read-only (like Vercel), return the raw base64 data URL so it gets saved inside the JSON successfully
    return base64DataUrl;
  }
}

// API endpoint to submit registration
app.post("/api/submit-registration", async (req, res) => {
  try {
    const {
      name,
      email,
      weight,
      height,
      age,
      goal,
      notes,
      programId,
      programTitleEn,
      programTitleAr,
      paymentMethod,
      paymentProof, // { name, data }
      uploadedFiles, // Array of { name, data }
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Save payment proof file
    let paymentProofUrl = null;
    if (paymentProof && paymentProof.data) {
      paymentProofUrl = saveBase64File(paymentProof.data, paymentProof.name || "payment_proof.png");
    }

    // Save uploaded progress photos
    const photoUrls: Array<{ name: string; url: string }> = [];
    if (uploadedFiles && Array.isArray(uploadedFiles)) {
      for (const file of uploadedFiles) {
        if (file && file.data) {
          const url = saveBase64File(file.data, file.name);
          if (url) {
            photoUrls.push({ name: file.name, url });
          }
        }
      }
    }

    // Create a new submission object
    const newSubmission = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      name,
      email,
      weight,
      height,
      age,
      goal,
      notes,
      programId,
      programTitleEn,
      programTitleAr,
      paymentMethod,
      paymentProofUrl,
      photos: photoUrls,
      status: "pending",
    };

    // Add to in-memory cache
    submissionsCache.push(newSubmission);

    // Attempt to save to submissions.json
    try {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissionsCache, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to write submission to local file system. Kept in memory only.", e);
    }

    // Return success response immediately, completely bypassing email sending as requested
    res.status(200).json({
      success: true,
      submissionId: newSubmission.id,
      emailSent: false,
      mailError: "Email sending disabled as requested",
      message: "Registration received and saved locally inside the application successfully.",
    });
  } catch (error: any) {
    console.error("Submission API error:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// API endpoint to retrieve submissions (secured/public-view for simplified dashboard)
app.get("/api/submissions", (req, res) => {
  try {
    // Try to read from filesystem to have the most up-to-date data, fallback to memory cache
    try {
      if (fs.existsSync(SUBMISSIONS_FILE)) {
        const fileData = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
        submissionsCache = JSON.parse(fileData);
      }
    } catch (e) {
      console.warn("Failed to read submissions from disk. Using memory cache.", e);
    }
    res.json(submissionsCache);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to load submissions" });
  }
});

// API endpoint to delete a submission
app.delete("/api/submissions/:id", (req, res) => {
  try {
    const { id } = req.params;
    
    // Also delete associated local files to save space if filesystem is writable
    const target = submissionsCache.find((s: any) => s.id === id);
    if (target) {
      if (target.paymentProofUrl) {
        try {
          const p = path.join(process.cwd(), target.paymentProofUrl);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        } catch (err) {
          console.warn("Could not delete payment proof file from disk", err);
        }
      }
      if (target.photos && Array.isArray(target.photos)) {
        for (const photo of target.photos) {
          try {
            const p = path.join(process.cwd(), photo.url);
            if (fs.existsSync(p)) fs.unlinkSync(p);
          } catch (err) {
            console.warn("Could not delete progress photo from disk", err);
          }
        }
      }
    }

    submissionsCache = submissionsCache.filter((s: any) => s.id !== id);

    try {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissionsCache, null, 2), "utf-8");
    } catch (e) {
      console.warn("Could not write updated submissions to disk after deletion.", e);
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to delete submission" });
  }
});

// API endpoint to bulk-import/restore submissions
app.post("/api/submissions/bulk-import", (req, res) => {
  try {
    const importedData = req.body;
    if (!Array.isArray(importedData)) {
      return res.status(400).json({ error: "Imported data must be an array" });
    }

    // Merge or replace depending on ID
    const mergedMap = new Map<string, any>();
    
    // Add existing cache items first
    submissionsCache.forEach((sub) => {
      if (sub && sub.id) {
        mergedMap.set(sub.id, sub);
      }
    });

    // Overwrite with or append imported items
    importedData.forEach((sub) => {
      if (sub && sub.id) {
        mergedMap.set(sub.id, sub);
      }
    });

    submissionsCache = Array.from(mergedMap.values());

    try {
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissionsCache, null, 2), "utf-8");
    } catch (e) {
      console.warn("Could not write imported submissions to disk.", e);
    }

    res.json({ success: true, submissions: submissionsCache });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to bulk import submissions" });
  }
});

// Vite middleware for development or Static server for production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
