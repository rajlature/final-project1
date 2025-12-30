import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

// Configure storage for multer
const uploadDir = path.join(process.cwd(), "client", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Video Routes
  app.get(api.videos.list.path, async (req, res) => {
    const videos = await storage.getVideos();
    res.json(videos);
  });

  app.get(api.videos.get.path, async (req, res) => {
    const video = await storage.getVideo(Number(req.params.id));
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  });

  app.post(api.videos.upload.path, upload.single("video"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    try {
      const video = await storage.createVideo({
        filename: req.file.filename,
        originalName: req.file.originalname,
      });

      // Automatically trigger processing
      processVideo(video.id, req.file.filename);

      res.status(201).json(video);
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Failed to upload video" });
    }
  });

  app.post(api.videos.process.path, async (req, res) => {
    const videoId = Number(req.params.id);
    const video = await storage.getVideo(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    processVideo(videoId, video.filename);
    res.status(202).json({ message: "Processing started", status: "processing" });
  });

  app.delete(api.videos.delete.path, async (req, res) => {
    await storage.deleteVideo(Number(req.params.id));
    res.status(204).send();
  });

  app.get(api.gps.list.path, async (req, res) => {
    const points = await storage.getGpsPoints(Number(req.params.id));
    res.json(points);
  });

  return httpServer;
}

function processVideo(videoId: number, filename: string) {
  storage.updateVideoStatus(videoId, "processing");

  // Spawn Python process
  const scriptPath = path.join(process.cwd(), "server", "analysis.py");
  const videoPath = path.join(process.cwd(), "client", "public", "uploads", filename);
  
  const pythonProcess = spawn("python3", [scriptPath, videoPath, String(videoId)]);

  let dataBuffer = "";

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python Output: ${data}`);
    dataBuffer += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on("close", async (code) => {
    if (code === 0) {
      try {
        // Parse the last valid JSON output from python script
        const lines = dataBuffer.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const results = JSON.parse(lastLine);
        
        await storage.updateVideoResults(videoId, results);
        
        // Add GPS points if available
        if (results.gpsPoints) {
          const points = results.gpsPoints.map((p: any) => ({
            ...p,
            videoId
          }));
          await storage.addGpsPoints(points);
        }
      } catch (e) {
        console.error("Failed to parse analysis results:", e);
        storage.updateVideoStatus(videoId, "failed");
      }
    } else {
      storage.updateVideoStatus(videoId, "failed");
    }
  });
}
