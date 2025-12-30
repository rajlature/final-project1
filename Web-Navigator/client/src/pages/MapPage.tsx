import { Layout } from "@/components/Layout";
import MapComponent from "@/components/MapComponent";
import { useVideos, useVideoGps } from "@/hooks/use-videos";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Navigation2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MapPage() {
  const { data: videos } = useVideos();
  const [selectedVideoId, setSelectedVideoId] = useState<string | undefined>();
  const [searchPlace, setSearchPlace] = useState("");
  
  const { data: gpsPoints, isLoading } = useVideoGps(parseInt(selectedVideoId || "0"));

  return (
    <Layout header={
      <div>
        <h1 className="text-3xl text-foreground">Smart Route Analysis</h1>
        <p className="text-muted-foreground mt-1">Search places and discover optimized traffic routes</p>
      </div>
    }>
      <div className="relative h-[calc(100vh-12rem)] w-full rounded-2xl overflow-hidden border border-border">
        {/* Search and Navigation Panel */}
        <div className="absolute top-4 left-4 z-[400] w-80 space-y-4">
           <Card className="p-4 bg-card/95 backdrop-blur border-border shadow-2xl">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Find a Place</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter destination..." 
                      className="pl-9 h-9" 
                      value={searchPlace}
                      onChange={(e) => setSearchPlace(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Historical Analysis</label>
                  <Select onValueChange={setSelectedVideoId} value={selectedVideoId}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Analyze past routes..." />
                    </SelectTrigger>
                    <SelectContent>
                      {videos?.map(v => (
                        <SelectItem key={v.id} value={v.id.toString()}>
                          {v.originalName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedVideoId && (
                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                      <Navigation2 className="w-4 h-4" />
                      Route Optimization
                    </div>
                    
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium">Active Road:</span>
                        <div className={`w-2 h-2 rounded-full ${gpsPoints?.[0]?.trafficDensity === 'high' ? 'bg-red-500' : 'bg-green-500'}`} />
                      </div>
                      <p className="text-sm text-foreground font-bold">{gpsPoints?.[0]?.roadName || 'Analyzing...'}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Smart Alternatives</p>
                      {gpsPoints?.[0]?.alternativeRoutes && (gpsPoints[0].alternativeRoutes as any[]).map((route: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-background border border-border text-xs">
                          <span className="font-medium">{route.name}</span>
                          <span className="text-green-500 font-bold uppercase">{route.density} Traffic</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
           </Card>

           <Card className="p-3 bg-card/90 backdrop-blur border-border shadow-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Legend</p>
                <div className="flex gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[10px]"><div className="w-2 h-2 rounded-full bg-green-500" />Low</span>
                  <span className="flex items-center gap-1 text-[10px]"><div className="w-2 h-2 rounded-full bg-amber-500" />Mid</span>
                  <span className="flex items-center gap-1 text-[10px]"><div className="w-2 h-2 rounded-full bg-red-500" />High</span>
                </div>
              </div>
           </Card>
        </div>

        <MapComponent points={gpsPoints || []} />
      </div>
    </Layout>
  );
}
