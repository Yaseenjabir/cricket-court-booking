import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Copy, Trash2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminPromos = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [promos, setPromos] = useState([
    {
      id: 1,
      code: "CRICKET10",
      discount: "10%",
      type: "percentage",
      usageLimit: 100,
      used: 47,
      expiry: "Jan 21, 2024",
      status: "active",
    },
    {
      id: 2,
      code: "PLAY25",
      discount: "25 SAR",
      type: "fixed",
      usageLimit: 50,
      used: 23,
      expiry: "Jan 25, 2024",
      status: "active",
    },
    {
      id: 3,
      code: "NEWUSER",
      discount: "15%",
      type: "percentage",
      usageLimit: 1,
      used: 156,
      expiry: "Feb 1, 2024",
      status: "active",
    },
    {
      id: 4,
      code: "WEEKEND20",
      discount: "20%",
      type: "percentage",
      usageLimit: 200,
      used: 200,
      expiry: "Jan 14, 2024",
      status: "expired",
    },
  ]);

  const togglePromoStatus = (id: number) => {
    setPromos(
      promos.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p
      )
    );
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex flex-col overflow-hidden w-full">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-background border-b p-4 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Promo Codes</h1>
            <p className="text-muted-foreground text-sm">
              Create and manage promotional discount codes
            </p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className=" sm:inline ml-1">Create New Promo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Promo Code</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Promo Code</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Enter code or generate"
                      defaultValue={generateCode()}
                    />
                    <Button variant="outline" size="icon">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Discount Type</Label>
                    <Select defaultValue="percentage">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          Percentage (%)
                        </SelectItem>
                        <SelectItem value="fixed">
                          Fixed Amount (SAR)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Discount Value</Label>
                    <Input type="number" placeholder="10" className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Usage Limit</Label>
                    <Input type="number" placeholder="100" className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Per customer: 1 use
                    </p>
                  </div>
                  <div>
                    <Label>Expiry (Days)</Label>
                    <Select defaultValue="7">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="default" className="flex-1">
                    Create Promo
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 lg:p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6">
            <div className="bg-card rounded-xl border p-4 lg:p-6">
              <p className="text-xs lg:text-sm text-muted-foreground mb-1">
                Active Promos
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">
                {promos.filter((p) => p.status === "active").length}
              </p>
            </div>
            <div className="bg-card rounded-xl border p-4 lg:p-6">
              <p className="text-xs lg:text-sm text-muted-foreground mb-1">
                Total Uses
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">
                {promos.reduce((acc, p) => acc + p.used, 0)}
              </p>
            </div>
            <div className="bg-card rounded-xl border p-4 lg:p-6">
              <p className="text-xs lg:text-sm text-muted-foreground mb-1">
                Total Discount Given
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-success">
                2,450 SAR
              </p>
            </div>
          </div>

          {/* Promos Table */}
          <div className="bg-card rounded-xl border overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[180px]">
                      Code
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[140px]">
                      Discount
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[180px]">
                      Usage
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[120px]">
                      Expiry
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[130px]">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[100px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {promos.map((promo) => (
                    <tr
                      key={promo.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs lg:text-sm text-foreground bg-muted px-2 py-1 rounded whitespace-nowrap">
                            {promo.code}
                          </span>
                          <button
                            onClick={() => copyCode(promo.code)}
                            className="p-1 hover:bg-muted rounded flex-shrink-0"
                          >
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-sm text-foreground whitespace-nowrap">
                          {promo.discount}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1 whitespace-nowrap">
                          ({promo.type})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 lg:w-24 h-2 bg-muted rounded-full overflow-hidden flex-shrink-0">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${Math.min(
                                  (promo.used / promo.usageLimit) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs lg:text-sm text-muted-foreground whitespace-nowrap">
                            {promo.used}/
                            {promo.usageLimit === 1 ? "∞" : promo.usageLimit}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs lg:text-sm text-muted-foreground whitespace-nowrap">
                        {promo.expiry}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={promo.status === "active"}
                            onCheckedChange={() => togglePromoStatus(promo.id)}
                            disabled={promo.status === "expired"}
                          />
                          <span
                            className={`text-xs lg:text-sm whitespace-nowrap ${
                              promo.status === "active"
                                ? "text-success"
                                : promo.status === "expired"
                                  ? "text-muted-foreground"
                                  : "text-destructive"
                            }`}
                          >
                            {promo.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-secondary/10 rounded-xl p-4">
            <p className="text-xs lg:text-sm text-muted-foreground">
              <strong>Note:</strong> Each promo code can only be used once per
              customer. Promo codes expire automatically 7 days after creation
              by default.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPromos;
