import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type PricingData = {
  weekdayDayRate: number;
  weekdayNightRate: number;
  weekendDayRate: number;
  weekendNightRate: number;
};

const AdminPricing = () => {
  const { toast } = useToast();
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);
        const response = await adminApi.pricing.getCurrent();
        if (response.success && response.data) {
          setPricing(response.data as unknown as PricingData);
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
        toast({
          title: "Error",
          description: "Failed to load pricing data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [toast]);

  const categoryColors: Record<string, string> = {
    "Weekday Day": "bg-secondary/20 text-secondary border-secondary",
    "Weekday Night": "bg-primary/20 text-primary border-primary",
    "Weekend Day": "bg-accent/20 text-accent border-accent",
    "Weekend Night": "bg-warning/20 text-warning border-warning",
  };

  const pricingRows = pricing
    ? [
        {
          id: 1,
          day: "Sun-Thu",
          time: "9 AM - 6 PM",
          category: "Weekday Day",
          price: pricing.weekdayDayRate,
        },
        {
          id: 2,
          day: "Sun-Thu",
          time: "6 PM - 9 AM",
          category: "Weekday Night",
          price: pricing.weekdayNightRate,
        },
        {
          id: 3,
          day: "Fri-Sat",
          time: "9 AM - 6 PM",
          category: "Weekend Day",
          price: pricing.weekendDayRate,
        },
        {
          id: 4,
          day: "Fri-Sat",
          time: "6 PM - 9 AM",
          category: "Weekend Night",
          price: pricing.weekendNightRate,
        },
      ]
    : [];

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
              View current hourly rates for different time slots and days
            </p>
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
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : pricing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div
                className={`p-4 rounded-lg border ${categoryColors["Weekday Day"]}`}
              >
                <p className="font-medium text-sm">Weekday Day</p>
                <p className="text-xs opacity-70 mt-1">
                  {pricing.weekdayDayRate} SAR/hr
                </p>
              </div>
              <div
                className={`p-4 rounded-lg border ${categoryColors["Weekday Night"]}`}
              >
                <p className="font-medium text-sm">Weekday Night</p>
                <p className="text-xs opacity-70 mt-1">
                  {pricing.weekdayNightRate} SAR/hr
                </p>
              </div>
              <div
                className={`p-4 rounded-lg border ${categoryColors["Weekend Day"]}`}
              >
                <p className="font-medium text-sm">Weekend Day</p>
                <p className="text-xs opacity-70 mt-1">
                  {pricing.weekendDayRate} SAR/hr
                </p>
              </div>
              <div
                className={`p-4 rounded-lg border ${categoryColors["Weekend Night"]}`}
              >
                <p className="font-medium text-sm">Weekend Night</p>
                <p className="text-xs opacity-70 mt-1">
                  {pricing.weekendNightRate} SAR/hr
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Pricing Table */}
        <div className="bg-card rounded-xl border overflow-hidden mb-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
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
                  {pricingRows.map((row) => (
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
                          <span className="font-medium text-foreground text-sm">
                            {row.price}
                          </span>
                          <span className="text-muted-foreground text-sm whitespace-nowrap">
                            SAR/hr
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
