import { Layout } from "@/components/Layout";
import { useVideos, useDeleteVideo, useProcessVideo } from "@/hooks/use-videos";
import { VideoUpload } from "@/components/VideoUpload";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Play, 
  Trash2, 
  MapPin, 
  FileText, 
  RefreshCw 
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Analysis() {
  const { data: videos, isLoading } = useVideos();
  const { mutate: deleteVideo } = useDeleteVideo();
  const { mutate: processVideo, isPending: isProcessing } = useProcessVideo();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 animate-pulse">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
    }
  };

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-foreground">Video Analysis</h1>
            <p className="text-muted-foreground mt-1">Manage and analyze traffic footage</p>
          </div>
          <VideoUpload />
        </div>
      }
    >
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-[300px]">Video Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Detected Vehicles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">Loading videos...</TableCell>
              </TableRow>
            ) : videos?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No videos found. Upload one to get started.
                </TableCell>
              </TableRow>
            ) : (
              videos?.map((video) => {
                const counts = video.vehicleCounts as any;
                const total = (counts?.car || 0) + (counts?.bus || 0) + (counts?.truck || 0);

                return (
                  <TableRow key={video.id} className="border-border hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="truncate max-w-[200px]" title={video.originalName}>{video.originalName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(video.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(video.createdAt || "").toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {video.status === 'completed' ? (
                        <span className="font-mono font-medium">{total} total</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                         {video.status === 'pending' && (
                           <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => processVideo(video.id)}
                            disabled={isProcessing}
                          >
                             <RefreshCw className={cn("w-3 h-3 mr-2", isProcessing && "animate-spin")} />
                             Process
                           </Button>
                         )}
                         
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link href={`/analysis/${video.id}`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Play className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/map?video=${video.id}`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <MapPin className="w-4 h-4 mr-2" />
                                View on Map
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              className="text-red-500 hover:text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-500/10"
                              onClick={() => deleteVideo(video.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
