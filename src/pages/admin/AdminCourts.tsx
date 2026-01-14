import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Power, Lightbulb, Wind, Tv } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import court1 from "@/assets/court-1.jpg";
import court2 from "@/assets/court-2.jpg";
import court3 from "@/assets/court-3.jpg";
import court4 from "@/assets/court-4.jpg";
import court5 from "@/assets/court-5.jpg";

const AdminCourts = () => {
  const [courts, setCourts] = useState([
    { id: 1, name: "Court 1 - Pro Lane", image: court1, status: "active", features: ["LED Lights", "Professional Nets", "Air Conditioned"] },
    { id: 2, name: "Court 2 - Practice Arena", image: court2, status: "active", features: ["LED Lights", "Bowling Machine", "Video Analysis"] },
    { id: 3, name: "Court 3 - Match Court", image: court3, status: "active", features: ["Full Size", "LED Lights", "Spectator Area"] },
    { id: 4, name: "Court 4 - Training Zone", image: court4, status: "maintenance", features: ["Multiple Wickets", "LED Lights", "Equipment Storage"] },
    { id: 5, name: "Court 5 - Elite Court", image: court5, status: "active", features: ["Premium Turf", "LED Lights", "VIP Lounge"] },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<any>(null);

  const toggleCourtStatus = (courtId: number) => {
    setCourts(courts.map(court => 
      court.id === courtId 
        ? { ...court, status: court.status === 'active' ? 'inactive' : 'active' }
        : court
    ));
  };

  const featureIcons: Record<string, any> = {
    "LED Lights": Lightbulb,
    "Air Conditioned": Wind,
    "Video Analysis": Tv,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Court Management</h1>
          <p className="text-muted-foreground">Manage all cricket courts and their configurations</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="w-4 h-4" />
              Add New Court
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Court</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="courtName">Court Name</Label>
                <Input id="courtName" placeholder="e.g., Court 6 - Premium Lane" />
              </div>
              <div>
                <Label htmlFor="courtDescription">Description</Label>
                <Input id="courtDescription" placeholder="Brief description of the court" />
              </div>
              <div>
                <Label>Features</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["LED Lights", "Air Conditioned", "Bowling Machine", "Video Analysis", "Spectator Area", "VIP Lounge"].map((feature) => (
                    <label key={feature} className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-muted/50">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="default" className="flex-1">Save Court</Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <div key={court.id} className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40">
              <img src={court.image} alt={court.name} className="w-full h-full object-cover" />
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                court.status === 'active' ? 'bg-success text-success-foreground' :
                court.status === 'maintenance' ? 'bg-warning text-warning-foreground' :
                'bg-muted text-muted-foreground'
              }`}>
                {court.status === 'active' ? 'Active' : court.status === 'maintenance' ? 'Maintenance' : 'Inactive'}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{court.name}</h3>
                  <p className="text-sm text-muted-foreground">Court ID: #{court.id}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {court.features.map((feature, index) => (
                  <span key={index} className="px-2 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={court.status === 'active'}
                    onCheckedChange={() => toggleCourtStatus(court.id)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {court.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingCourt(court)}>
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Court</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="editCourtName">Court Name</Label>
                          <Input id="editCourtName" defaultValue={court.name} />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <div className="flex gap-2 mt-2">
                            <Button variant={court.status === 'active' ? 'default' : 'outline'} size="sm">Active</Button>
                            <Button variant={court.status === 'maintenance' ? 'warning' : 'outline'} size="sm">Maintenance</Button>
                            <Button variant={court.status === 'inactive' ? 'destructive' : 'outline'} size="sm">Inactive</Button>
                          </div>
                        </div>
                        <div>
                          <Label>Features</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {["LED Lights", "Air Conditioned", "Bowling Machine", "Video Analysis", "Spectator Area", "VIP Lounge"].map((feature) => (
                              <label key={feature} className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-muted/50">
                                <input type="checkbox" className="rounded" defaultChecked={court.features.includes(feature)} />
                                <span className="text-sm">{feature}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button variant="default" className="flex-1">Save Changes</Button>
                          <Button variant="outline" className="flex-1">Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Power className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{courts.filter(c => c.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">Active Courts</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Power className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{courts.filter(c => c.status === 'maintenance').length}</p>
              <p className="text-sm text-muted-foreground">Under Maintenance</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Power className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{courts.filter(c => c.status === 'inactive').length}</p>
              <p className="text-sm text-muted-foreground">Inactive Courts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourts;
