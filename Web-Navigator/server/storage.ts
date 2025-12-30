import { db } from "./db";
import {
  videos,
  gpsPoints,
  type Video,
  type InsertVideo,
  type GpsPoint,
  type InsertGpsPoint,
  type VideoStatus
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getVideos(): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideoStatus(id: number, status: VideoStatus): Promise<Video>;
  updateVideoResults(id: number, results: any): Promise<Video>;
  deleteVideo(id: number): Promise<void>;
  
  getGpsPoints(videoId: number): Promise<GpsPoint[]>;
  addGpsPoints(points: InsertGpsPoint[]): Promise<GpsPoint[]>;
}

export class DatabaseStorage implements IStorage {
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(videos.createdAt);
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async updateVideoStatus(id: number, status: VideoStatus): Promise<Video> {
    const [updated] = await db
      .update(videos)
      .set({ status })
      .where(eq(videos.id, id))
      .returning();
    return updated;
  }

  async updateVideoResults(id: number, results: any): Promise<Video> {
    const [updated] = await db
      .update(videos)
      .set({ 
        vehicleCounts: results.counts,
        processedUrl: results.processedUrl,
        thumbnailUrl: results.thumbnailUrl,
        status: 'completed'
      })
      .where(eq(videos.id, id))
      .returning();
    return updated;
  }

  async deleteVideo(id: number): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  async getGpsPoints(videoId: number): Promise<GpsPoint[]> {
    return await db.select().from(gpsPoints).where(eq(gpsPoints.videoId, videoId));
  }

  async addGpsPoints(points: InsertGpsPoint[]): Promise<GpsPoint[]> {
    if (points.length === 0) return [];
    return await db.insert(gpsPoints).values(points).returning();
  }
}

export const storage = new DatabaseStorage();
