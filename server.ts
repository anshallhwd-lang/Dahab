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

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), "utf-8");
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
    console.error("Error saving base64 file:", error);
    return null;
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

    // Save to submissions.json
    let submissions = [];
    try {
      const fileData = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
      submissions = JSON.parse(fileData);
    } catch (e) {
      submissions = [];
    }
    submissions.push(newSubmission);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");

    // Attempt to send email to m3369703@gmail.com
    const targetEmail = "m3369703@gmail.com";
    
    // Configure mailer
    const smtpHost = process.env.SMTP_HOST || "";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";

    let emailSent = false;
    let mailError = "";

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost || "smtp.gmail.com",
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const goalText = goal === "gain" ? "Bulk/Muscle Gain" : goal === "shred" ? "Cut/Fat Loss" : "General Health";
        const emailBodyHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fdfdfd;">
            <h2 style="color: #e4562f; text-align: center; border-bottom: 2px solid #e4562f; padding-bottom: 10px;">
              New Registration: ${name}
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 8px; font-weight: bold; width: 35%;">Selected Program:</td>
                <td style="padding: 8px;">${programTitleEn} (${programTitleAr})</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Client Name:</td>
                <td style="padding: 8px;">${name}</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 8px; font-weight: bold;">Email Address:</td>
                <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Age:</td>
                <td style="padding: 8px;">${age} years old</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 8px; font-weight: bold;">Weight:</td>
                <td style="padding: 8px;">${weight} kg</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Height:</td>
                <td style="padding: 8px;">${height} cm</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 8px; font-weight: bold;">Goal:</td>
                <td style="padding: 8px; font-weight: ${goal === "shred" ? "bold" : "normal"}; color: ${goal === "shred" ? "#e4562f" : "#333"};">${goalText}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Payment Method:</td>
                <td style="padding: 8px; font-weight: bold; color: #10b981;">${paymentMethod.toUpperCase()}</td>
              </tr>
            </table>

            <div style="margin-top: 20px; padding: 12px; background-color: #f9f9f9; border-left: 4px solid #e4562f; border-radius: 4px;">
              <strong style="display: block; margin-bottom: 5px;">Client Notes / Injuries / Health Info:</strong>
              <p style="margin: 0; font-style: italic; color: #555;">${notes || "None provided"}</p>
            </div>

            <h3 style="color: #333; margin-top: 25px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Attachments Info:</h3>
            <ul style="padding-left: 20px;">
              <li><strong>Payment Proof:</strong> ${paymentProofUrl ? "Attached successfully" : "Not uploaded / failed"}</li>
              <li><strong>Progress Photos:</strong> ${photoUrls.length} photo(s) uploaded</li>
            </ul>

            <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 15px;">
              This notification was generated automatically by the Elite Custom Program Registration System.
            </div>
          </div>
        `;

        const attachments: any[] = [];
        
        // Attach payment proof
        if (paymentProofUrl) {
          const absolutePath = path.join(process.cwd(), paymentProofUrl);
          if (fs.existsSync(absolutePath)) {
            attachments.push({
              filename: paymentProof?.name || "payment_proof.png",
              path: absolutePath
            });
          }
        }

        // Attach progress photos
        for (const p of photoUrls) {
          const absolutePath = path.join(process.cwd(), p.url);
          if (fs.existsSync(absolutePath)) {
            attachments.push({
              filename: p.name,
              path: absolutePath
            });
          }
        }

        await transporter.sendMail({
          from: `"Elite Program Registration" <${smtpUser}>`,
          to: targetEmail,
          subject: `🏋️ New Registration: ${name} (${programTitleEn})`,
          html: emailBodyHtml,
          attachments
        });

        emailSent = true;
      } catch (err: any) {
        console.error("Nodemailer send failed:", err);
        mailError = err?.message || "Unknown mailer error";
      }
    } else {
      console.warn("SMTP credentials not provided in env variables. Email notification was not sent. Registration saved locally to submissions.json.");
      mailError = "SMTP credentials missing";
    }

    res.status(200).json({
      success: true,
      submissionId: newSubmission.id,
      emailSent,
      mailError: emailSent ? null : mailError,
      message: emailSent
        ? "Registration received and email notification sent successfully"
        : "Registration received and saved locally (Email sending skipped/failed)",
    });
  } catch (error: any) {
    console.error("Submission API error:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// API endpoint to retrieve submissions (secured/public-view for simplified dashboard)
app.get("/api/submissions", (req, res) => {
  try {
    const fileData = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    const submissions = JSON.parse(fileData);
    res.json(submissions);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to load submissions" });
  }
});

// API endpoint to delete a submission
app.delete("/api/submissions/:id", (req, res) => {
  try {
    const { id } = req.params;
    const fileData = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
    let submissions = JSON.parse(fileData);
    
    // Also delete associated local files to save space
    const target = submissions.find((s: any) => s.id === id);
    if (target) {
      if (target.paymentProofUrl) {
        const p = path.join(process.cwd(), target.paymentProofUrl);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      }
      if (target.photos && Array.isArray(target.photos)) {
        for (const photo of target.photos) {
          const p = path.join(process.cwd(), photo.url);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        }
      }
    }

    submissions = submissions.filter((s: any) => s.id !== id);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to delete submission" });
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
