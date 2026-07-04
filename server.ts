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

// Serve uploads directory as static
app.use("/data/uploads", express.static(UPLOADS_DIR));

// API endpoint to submit registration
app.post("/api/submit-registration", async (req, res) => {
  try {
    const { name, email, weight, height, age, goal, notes, programTitleEn, paymentMethod } = req.body;
    console.log(`Received registration request for ${name} (${email})`);

    let webhookUrl = process.env.GOOGLE_SHEETS_COURSES_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl || !webhookUrl.includes("AKfycbxJi-2-7noOBRO1HDlUwL8CrTuD15kKVYBicB4ky9KCledfJNa6eSyvey6MTZ9EEUhA")) {
      webhookUrl = "https://script.google.com/macros/s/AKfycbxJi-2-7noOBRO1HDlUwL8CrTuD15kKVYBicB4ky9KCledfJNa6eSyvey6MTZ9EEUhA/exec";
    }
    if (webhookUrl) {
      console.log("Forwarding submission to Google Sheets Webhook (Courses)...");
      
      // Fire-and-forget or fast await so we don't hold the user's connection too long
      // We will wrap in a try-catch to keep it robust and resilient
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...req.body, dataType: "course_registration" }),
        });

        if (response.ok) {
          console.log("Successfully sent registration data to Google Sheets!");
        } else {
          const errText = await response.text().catch(() => "");
          console.error(`Google Sheets Webhook returned error code: ${response.status}. Response: ${errText.slice(0, 300)}`);
        }
      } catch (webhookErr) {
        console.error("Failed to forward data to Google Sheets webhook:", webhookErr);
      }
    } else {
      console.log("GOOGLE_SHEETS_WEBHOOK_URL is not configured. Skipping Google Sheets update.");
    }

    res.status(200).json({
      success: true,
      message: "Registration received successfully.",
    });
  } catch (error: any) {
    console.error("Submission API error:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// API endpoint to submit product purchase
app.post("/api/submit-purchase", async (req, res) => {
  try {
    const { name, email, phone, country, address, productName, productSize, quantity, totalPrice, paymentMethod } = req.body;
    console.log(`Received purchase request from ${name} (${email}) for ${productName} (${productSize})`);

    let webhookUrl = process.env.GOOGLE_SHEETS_SUPPLEMENTS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl || !webhookUrl.includes("AKfycbysS52BPYIMwUesRjRz5LesEWWrSg3h9HjNMHrj7L0M4cyJNVIhcvmSyo39NxeRNJJN")) {
      webhookUrl = "https://script.google.com/macros/s/AKfycbysS52BPYIMwUesRjRz5LesEWWrSg3h9HjNMHrj7L0M4cyJNVIhcvmSyo39NxeRNJJN/exec";
    }
    if (webhookUrl) {
      console.log("Forwarding purchase to Google Sheets Webhook (Supplements)...");
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...req.body, dataType: "supplement_purchase" }),
        });

        if (response.ok) {
          console.log("Successfully sent purchase data to Google Sheets!");
        } else {
          const errText = await response.text().catch(() => "");
          console.error(`Google Sheets Webhook returned error code: ${response.status}. Response: ${errText.slice(0, 300)}`);
        }
      } catch (webhookErr) {
        console.error("Failed to forward data to Google Sheets webhook:", webhookErr);
      }
    } else {
      console.log("GOOGLE_SHEETS_WEBHOOK_URL is not configured. Skipping Google Sheets update.");
    }

    res.status(200).json({
      success: true,
      message: "Purchase order received successfully.",
    });
  } catch (error: any) {
    console.error("Purchase API error:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
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
