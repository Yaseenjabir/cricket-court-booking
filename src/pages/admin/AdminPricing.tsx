import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, RotateCcw } from "lucide-react";

const AdminPricing = () => {
  const [pricing, setPricing] = useState([
    { id: 1, day: "Sun-Wed", time: "9 AM - 7 PM", category: "Weekday Day", price: 90 },
    { id: 2, day: "Sun-Wed", time: "7 PM - 4 AM", category: "Weekday Night", price: 110 },
    { id: 3, day: "Thursday", time: "9 AM - 7 PM", category: "Weekday Day", price: 90 },
    { id: 4, day: "Thursday", time: "7 PM - 4 AM", category: "Weekend Night", price: 135 },
    { id: 5, day: "Friday", time: "9 AM - 7 PM", category: "Weekend Day", price: 110 },
    { id: 6, day: "Friday", time: "7 PM - 4 AM", category: "Weekend Night", price: 135 },
    { id: 7, day: "Saturday", time: "9 AM - 7 PM", category: "Weekend Day", price: 110 },
    { id: 8, day: "Saturday", time: "7 PM - 4 AM", category: "Weekday Night", price: 110 },
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  const categoryColors: Record<string, string> = {
    "Weekday Day": "bg-secondary/20 text-secondary border-secondary",
    "Weekday Night": "bg-primary/20 text-primary border-primary",
    "Weekend Day": "bg-accent/20 text-accent border-accent",
    "Weekend Night": "bg-warning/20 text-warning border-warning",
  };

  const updatePrice = (id: number, newPrice: number) => {
    setPricing(pricing.map(p => p.id === id ? { ...p, price: newPrice } : p));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulate save
    setHasChanges(false);
  };

  const handleReset = () => {
    setPricing([
      { id: 1, day: "Sun-Wed", time: "9 AM - 7 PM", category: "Weekday Day", price: 90 },
      { id: 2, day: "Sun-Wed", time: "7 PM - 4 AM", category: "Weekday Night", price: 110 },
      { id: 3, day: "Thursday", time: "9 AM - 7 PM", category: "Weekday Day", price: 90 },
      { id: 4, day: "Thursday", time: "7 PM - 4 AM", category: "Weekend Night", price: 135 },
      { id: 5, day: "Friday", time: "9 AM - 7 PM", category: "Weekend Day", price: 110 },
      { id: 6, day: "Friday", time: "7 PM - 4 AM", category: "Weekend Night", price: 135 },
      { id: 7, day: "Saturday", time: "9 AM - 7 PM", category: "Weekend Day", price: 110 },
      { id: 8, day: "Saturday", time: "7 PM - 4 AM", category: "Weekday Night", price: 110 },
    ]);
    setHasChanges(false);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing Management</h1>
          <p className="text-muted-foreground">Configure hourly rates for different time slots and days</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button variant="default" onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Price Legend */}
      <div className="bg-card rounded-xl border p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-4">Price Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryColors).map(([category, colors]) => (
            <div key={category} className={`p-4 rounded-lg border ${colors}`}>
              <p className="font-medium">{category}</p>
              <p className="text-sm opacity-70">
                {category.includes("Weekend Night") ? "135 SAR/hr" :
                 category.includes("Night") || category.includes("Weekend Day") ? "110 SAR/hr" :
                 "90 SAR/hr"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Day</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Time Slot</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Category</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Price (SAR/hr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pricing.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">{row.day}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-muted-foreground">{row.time}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[row.category]}`}>
                      {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Input
                        type="number"
                        value={row.price}
                        onChange={(e) => updatePrice(row.id, parseInt(e.target.value) || 0)}
                        className="w-24 text-right"
                      />
                      <span className="text-muted-foreground text-sm">SAR</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-semibold text-foreground mb-4">Online Payment Discount</h3>
          <div className="flex items-center gap-4">
            <Input type="number" defaultValue={2} className="w-20" />
            <span className="text-muted-foreground">% discount for 100% online payment</span>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-semibold text-foreground mb-4">Minimum Booking Duration</h3>
          <div className="flex items-center gap-4">
            <Input type="number" defaultValue={1} className="w-20" />
            <span className="text-muted-foreground">hour(s) minimum</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-secondary/10 rounded-xl p-4 mt-6">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Price changes will take effect immediately for new bookings. 
          Existing bookings will retain their original pricing. Overnight slots (12 AM - 4 AM) 
          follow the pricing of the previous calendar day.
        </p>
      </div>
    </div>
  );
};

export default AdminPricing;
