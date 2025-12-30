import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { VideoUpload } from "@/components/VideoUpload";
import { useVideos } from "@/hooks/use-videos";
import { Activity, Car, Truck, Bus, Video as VideoIcon, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: videos, isLoading } = useVideos();

  const stats = {
    totalVideos: videos?.length || 0,
    processed: videos?.filter(v => v.status === 'completed').length || 0,
    totalVehicles: videos?.reduce((acc, v) => {
      const counts = v.vehicleCounts as Record<string, number>;
      return acc + (counts.car || 0) + (counts.bus || 0) + (counts.truck || 0);
    }, 0) || 0,
    activeAlerts: 2 // Mock data for demo
  };

  const chartData = [
    { name: 'Cars', value: videos?.reduce((acc, v) => acc + ((v.vehicleCounts as any)?.car || 0), 0) || 0, color: '#22d3ee' },
    { name: 'Trucks', value: videos?.reduce((acc, v) => acc + ((v.vehicleCounts as any)?.truck || 0), 0) || 0, color: '#a855f7' },
    { name: 'Buses', value: videos?.reduce((acc, v) => acc + ((v.vehicleCounts as any)?.bus || 0), 0) || 0, color: '#f59e0b' },
    { name: 'Motorcycles', value: videos?.reduce((acc, v) => acc + ((v.vehicleCounts as any)?.motorcycle || 0), 0) || 0, color: '#ec4899' },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[50vh]">
          <Activity className="w-10 h-10 text-primary animate-pulse" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      header={
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time traffic analytics overview</p>
          </div>
          <VideoUpload />
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Vehicles Detected" 
          value={stats.totalVehicles} 
          icon={Car} 
          trend="+12% vs last week" 
          trendUp={true} 
          color="primary"
        />
        <StatsCard 
          title="Processed Videos" 
          value={stats.processed} 
          icon={VideoIcon} 
          color="accent"
        />
        <StatsCard 
          title="Heavy Vehicles" 
          value={(videos?.reduce((acc, v) => acc + ((v.vehicleCounts as any)?.truck || 0) + ((v.vehicleCounts as any)?.bus || 0), 0) || 0)} 
          icon={Truck} 
          trend="High Traffic"
          trendUp={false}
          color="orange"
        />
        <StatsCard 
          title="Active Alerts" 
          value={stats.activeAlerts} 
          icon={AlertTriangle} 
          color="accent" // fallback
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-display">Vehicle Distribution</h3>
            <select className="bg-background border border-border rounded-lg text-sm px-3 py-1 text-muted-foreground focus:outline-none focus:border-primary">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold font-display mb-6">Recent Uploads</h3>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {videos?.slice(0, 5).map((video) => (
              <Link key={video.id} href={`/analysis/${video.id}`} className="block">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <VideoIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{video.originalName}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      {new Date(video.createdAt || "").toLocaleDateString()}
                      <span className={cn(
                        "inline-block w-1.5 h-1.5 rounded-full",
                        video.status === 'completed' ? "bg-green-500" :
                        video.status === 'processing' ? "bg-yellow-500" : "bg-red-500"
                      )} />
                      <span className="capitalize">{video.status}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {(!videos || videos.length === 0) && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No videos uploaded yet.
              </div>
            )}
          </div>
          <Link href="/analysis" className="mt-6 text-sm text-primary hover:underline text-center block">
            View All Activity →
          </Link>
        </div>
      </div>
    </Layout>
  );
}
