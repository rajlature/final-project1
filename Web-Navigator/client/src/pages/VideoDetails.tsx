import { useRoute } from "wouter";
import { useVideo, useVideoGps } from "@/hooks/use-videos";
import { Layout } from "@/components/Layout";
import MapComponent from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Car, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";

export default function VideoDetails() {
  const [, params] = useRoute("/analysis/:id");
  const id = parseInt(params?.id || "0");
  const { data: video, isLoading: videoLoading } = useVideo(id);
  const { data: gpsPoints, isLoading: gpsLoading } = useVideoGps(id);

  if (videoLoading || gpsLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!video) return <div className="p-8 text-center">Video not found</div>;

  const counts = video.vehicleCounts as any;

  return (
    <Layout>
      <div className="mb-6">
        <Link href="/analysis">
          <Button variant="ghost" className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Videos
          </Button>
        </Link>
        <div className="mt-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl text-foreground font-display">{video.originalName}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(video.createdAt!).toLocaleString()}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {gpsPoints?.length || 0} GPS Points</span>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Action buttons could go here */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Video Info */}
        <div className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="font-bold font-display text-lg mb-4">Detection Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-md text-blue-500"><Car className="w-4 h-4" /></div>
                  <span className="font-medium">Cars</span>
                </div>
                <span className="font-bold text-lg">{counts?.car || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-md text-purple-500"><Car className="w-4 h-4" /></div>
                  <span className="font-medium">Trucks</span>
                </div>
                <span className="font-bold text-lg">{counts?.truck || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-md text-orange-500"><Car className="w-4 h-4" /></div>
                  <span className="font-medium">Buses</span>
                </div>
                <span className="font-bold text-lg">{counts?.bus || 0}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
             <h3 className="font-bold font-display text-lg mb-4">Metadata</h3>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="uppercase font-medium text-primary">{video.status}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Filename</span>
                  <span className="font-medium truncate max-w-[150px]">{video.filename}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">--:--</span>
                </div>
             </div>
          </Card>
        </div>

        {/* Right Column - Map Visualization */}
        <div className="lg:col-span-2 h-[600px] bg-card border border-border rounded-xl p-1 relative">
          {/* In a real app, you might overlay the video player here or have them side-by-side */}
          {gpsPoints && gpsPoints.length > 0 ? (
            <MapComponent points={gpsPoints} />
          ) : (
             <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground">
               <div className="text-center">
                 <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                 <p>No GPS data available for this video</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
