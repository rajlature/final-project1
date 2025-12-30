import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Shield, Bell, Database, Monitor } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SystemSettings() {
  return (
    <Layout
      header={
        <div>
          <h1 className="text-3xl text-foreground font-display">System Configuration</h1>
          <p className="text-muted-foreground mt-1">Manage system-wide preferences and settings</p>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              General Settings
            </CardTitle>
            <CardDescription>Configure core system behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-processing</Label>
                <p className="text-xs text-muted-foreground">Automatically process videos after upload</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Real-time updates</Label>
                <p className="text-xs text-muted-foreground">Update dashboard in real-time</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </CardTitle>
            <CardDescription>Control how you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Alerts</Label>
                <p className="text-xs text-muted-foreground">Receive incident reports via email</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Browser-based traffic alerts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-orange-500" />
              Storage Management
            </CardTitle>
            <CardDescription>Configure data retention and backups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Retention Period</Label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>30 Days</option>
                <option>90 Days</option>
                <option>1 Year</option>
                <option>Unlimited</option>
              </select>
            </div>
            <Button variant="outline" className="w-full border-border hover:bg-muted">Clear Processed Cache</Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Security
            </CardTitle>
            <CardDescription>System access and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <p className="text-sm font-medium">API Access Key</p>
              <code className="text-xs block mt-1 text-muted-foreground bg-background p-2 rounded">
                tr_live_••••••••••••••••
              </code>
            </div>
            <Button className="w-full">Regenerate Key</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button size="lg" className="shadow-lg shadow-primary/20">Save All Changes</Button>
      </div>
    </Layout>
  );
}
