import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Video, GpsPoint } from "@shared/schema";

// Helper to handle API errors
const handleApiError = async (res: Response) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  return res;
};

// ============================================
// VIDEOS
// ============================================

export function useVideos() {
  return useQuery({
    queryKey: [api.videos.list.path],
    queryFn: async () => {
      const res = await fetch(api.videos.list.path, { credentials: "include" });
      await handleApiError(res);
      return api.videos.list.responses[200].parse(await res.json());
    },
  });
}

export function useVideo(id: number) {
  return useQuery({
    queryKey: [api.videos.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.videos.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      await handleApiError(res);
      return api.videos.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useUploadVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(api.videos.upload.path, {
        method: api.videos.upload.method,
        body: formData, // Browser sets Content-Type to multipart/form-data automatically
        credentials: "include",
      });
      await handleApiError(res);
      return api.videos.upload.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.videos.list.path] });
    },
  });
}

export function useProcessVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.videos.process.path, { id });
      const res = await fetch(url, {
        method: api.videos.process.method,
        credentials: "include",
      });
      await handleApiError(res);
      return api.videos.process.responses[202].parse(await res.json());
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [api.videos.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.videos.get.path, id] });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.videos.delete.path, { id });
      const res = await fetch(url, {
        method: api.videos.delete.method,
        credentials: "include",
      });
      await handleApiError(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.videos.list.path] });
    },
  });
}

// ============================================
// GPS
// ============================================

export function useVideoGps(videoId: number) {
  return useQuery({
    queryKey: [api.gps.list.path, videoId],
    queryFn: async () => {
      const url = buildUrl(api.gps.list.path, { id: videoId });
      const res = await fetch(url, { credentials: "include" });
      await handleApiError(res);
      return api.gps.list.responses[200].parse(await res.json());
    },
    enabled: !!videoId,
  });
}
