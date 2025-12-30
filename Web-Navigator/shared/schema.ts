import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  vehicleCounts: jsonb("vehicle_counts").default({ car: 0, bus: 0, truck: 0, motorcycle: 0 }),
  processedUrl: text("processed_url"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gpsPoints = pgTable("gps_points", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  speed: real("speed"), // km/h
  roadName: text("road_name"),
  trafficDensity: text("traffic_density"), // low, medium, high
  alternativeRoutes: jsonb("alternative_routes"), // Array of { name: string, density: string, points: [lat, lng][] }
});

export const insertVideoSchema = createInsertSchema(videos).omit({ 
  id: true, 
  createdAt: true, 
  status: true,
  vehicleCounts: true,
  processedUrl: true,
  thumbnailUrl: true
});

export const insertGpsPointSchema = createInsertSchema(gpsPoints).omit({ id: true, timestamp: true });

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type GpsPoint = typeof gpsPoints.$inferSelect;
export type InsertGpsPoint = z.infer<typeof insertGpsPointSchema>;

export type VideoStatus = "pending" | "processing" | "completed" | "failed";
