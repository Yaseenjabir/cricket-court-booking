import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, RotateCcw } from "lucide-react";

const AdminPricing = () => {
  const [pricing, setPricing] = useState([
    {
      id: 1,
      day: "Sun-Wed",
      time: "9 AM - 7 PM",
      category: "Weekday Day",
      price: 90,
    },
    {
      id: 2,
      day: "Sun-Wed",
      time: "7 PM - 4 AM",
      category: "Weekday Night",
      price: 110,
    },
    {
      id: 3,
      day: "Thursday",
      time: "9 AM - 7 PM",
      category: "Weekday Day",
      price: 90,
    },
    {
      id: 4,
      day: "Thursday",
      time: "7 PM - 4 AM",
      category: "Weekend Night",
      price: 135,
    },
    {
      id: 5,
      day: "Friday",
      time: "9 AM - 7 PM",
      category: "Weekend Day",
      price: 110,
    },
    {
      id: 6,
      day: "Friday",
      time: "7 PM - 4 AM",
      category: "Weekend Night",
      price: 135,
    },
    {
      id: 7,
      day: "Saturday",
      time: "9 AM - 7 PM",
      category: "Weekend Day",
      price: 110,
    },
    {
      id: 8,
      day: "Saturday",
      time: "7 PM - 4 AM",
      category: "Weekday Night",
      price: 110,
    },
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  const categoryColors: Record<string, string> = {
    "Weekday Day": "bg-secondary/20 text-secondary border-secondary",
    "Weekday Night": "bg-primary/20 text-primary border-primary",
    "Weekend Day": "bg-accent/20 text-accent border-accent",
    "Weekend Night": "bg-warning/20 text-warning border-warning",
  };

  const updatePrice = (id: number, newPrice: number) => {
    setPricing(
      pricing.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulate save
    setHasChanges(false);
  };

  const handleReset = () => {
    setPricing([
      {
        id: 1,
        day: "Sun-Wed",
        time: "9 AM - 7 PM",
        category: "Weekday Day",
        price: 90,
      },
      {
        id: 2,
        day: "Sun-Wed",
        time: "7 PM - 4 AM",
        category: "Weekday Night",
        price: 110,
      },
      {
        id: 3,
        day: "Thursday",
        time: "9 AM - 7 PM",
        category: "Weekday Day",
        price: 90,
      },
      {
        id: 4,
        day: "Thursday",
        time: "7 PM - 4 AM",
        category: "Weekend Night",
        price: 135,
      },
      {
        id: 5,
        day: "Friday",
        time: "9 AM - 7 PM",
        category: "Weekend Day",
        price: 110,
      },
      {
        id: 6,
        day: "Friday",
        time: "7 PM - 4 AM",
        category: "Weekend Night",
        price: 135,
      },
      {
        id: 7,
        day: "Saturday",
        time: "9 AM - 7 PM",
        category: "Weekend Day",
        price: 110,
      },
      {
        id: 8,
        day: "Saturday",
        time: "7 PM - 4 AM",
        category: "Weekday Night",
        price: 110,
      },
    ]);
    setHasChanges(false);
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-background border-b p-4 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Pricing Management
            </h1>
            <p className="text-muted-foreground text-sm">
              Configure hourly rates for different time slots and days
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges}
              size="sm"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">Reset</span>
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={!hasChanges}
              size="sm"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">Save</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-auto p-4 lg:p-6 w-full">
        {/* Price Legend */}
        <div className="bg-card rounded-xl border p-4 lg:p-6 mb-6">
          <h2 className="font-semibold text-foreground mb-4">
            Price Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(categoryColors).map(([category, colors]) => (
              <div key={category} className={`p-4 rounded-lg border ${colors}`}>
                <p className="font-medium text-sm">{category}</p>
                <p className="text-xs opacity-70 mt-1">
                  {category.includes("Weekend Night")
                    ? "135 SAR/hr"
                    : category.includes("Night") ||
                        category.includes("Weekend Day")
                      ? "110 SAR/hr"
                      : "90 SAR/hr"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-card rounded-xl border overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground uppercase w-[120px]">
                    Day
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground uppercase w-[150px]">
                    Time Slot
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground uppercase w-[180px]">
                    Category
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-foreground uppercase w-[180px]">
                    Price (SAR/hr)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pricing.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground text-sm whitespace-nowrap">
                        {row.day}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground text-sm whitespace-nowrap">
                        {row.time}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                          categoryColors[row.category]
                        }`}
                      >
                        {row.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Input
                          type="number"
                          value={row.price}
                          onChange={(e) =>
                            updatePrice(row.id, parseInt(e.target.value) || 0)
                          }
                          className="w-20 text-right text-sm"
                        />
                        <span className="text-muted-foreground text-sm whitespace-nowrap">
                          SAR
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6">
          <div className="bg-card rounded-xl border p-4 lg:p-6">
            <h3 className="font-semibold text-foreground mb-3 text-sm lg:text-base">
              Online Payment Discount
            </h3>
            <div className="flex items-center gap-3">
              <Input type="number" defaultValue={2} className="w-16 text-sm" />
              <span className="text-muted-foreground text-xs lg:text-sm">
                % discount for 100% online payment
              </span>
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 lg:p-6">
            <h3 className="font-semibold text-foreground mb-3 text-sm lg:text-base">
              Minimum Booking Duration
            </h3>
            <div className="flex items-center gap-3">
              <Input type="number" defaultValue={1} className="w-16 text-sm" />
              <span className="text-muted-foreground text-xs lg:text-sm">
                hour(s) minimum
              </span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-secondary/10 rounded-xl p-4">
          <p className="text-xs lg:text-sm text-muted-foreground">
            <strong>Note:</strong> Price changes will take effect immediately
            for new bookings. Existing bookings will retain their original
            pricing. Overnight slots (12 AM - 4 AM) follow the pricing of the
            previous calendar day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPricing;
