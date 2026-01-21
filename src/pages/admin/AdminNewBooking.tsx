import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, ArrowLeft, Check, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { adminApi, pricingApi } from "@/lib/api";
import { Court, Pricing, TimeSlot } from "@/types/booking.types";

const AdminNewBooking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCourt, setSelectedCourt] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [notes, setNotes] = useState("");

  // Customer form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Loading states
  const [loadingCourts, setLoadingCourts] = useState(true);
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data states
  const [courts, setCourts] = useState<Court[]>([]);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Fetch courts on mount
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoadingCourts(true);
        const response = await adminApi.courts.getAll();
        if (response.success && response.data) {
          setCourts(response.data);
          if (response.data.length > 0) {
            setSelectedCourt(response.data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch courts:", error);
        toast({
          title: "Error",
          description: "Failed to load courts",
          variant: "destructive",
        });
      } finally {
        setLoadingCourts(false);
      }
    };

    fetchCourts();
  }, [toast]);

  // Fetch pricing on mount
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoadingPricing(true);
        const response = await pricingApi.getCurrent();
        if (response.success && response.data) {
          setPricing(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
        toast({
          title: "Error",
          description: "Failed to load pricing",
          variant: "destructive",
        });
      } finally {
        setLoadingPricing(false);
      }
    };

    fetchPricing();
  }, [toast]);

  // Generate time slots when court, date, or pricing changes
  useEffect(() => {
    if (selectedCourt && pricing) {
      generateTimeSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourt, selectedDate, pricing]);

  // Generate time slots from 9 AM to 4 AM (next day)
  const generateTimeSlots = () => {
    if (!pricing) return;

    const slots = [];
    const isWeekend = [5, 6].includes(selectedDate.getDay()); // Friday=5, Saturday=6

    // 9 AM to 11 PM
    for (let hour = 9; hour < 24; hour++) {
      const isNight = hour >= 19; // 7 PM onwards
      let price = 0;

      if (isWeekend) {
        price = isNight ? pricing.weekendNightRate : pricing.weekendDayRate;
      } else {
        price = isNight ? pricing.weekdayNightRate : pricing.weekdayDayRate;
      }

      slots.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        display: `${hour > 12 ? hour - 12 : hour}:00 ${
          hour >= 12 ? "PM" : "AM"
        }`,
        available: true, // Admin can book any slot
        price,
        category: isNight ? "night" : "day",
        isWeekend,
      });
    }

    // 12 AM to 4 AM (next day)
    for (let hour = 0; hour < 4; hour++) {
      const price = isWeekend
        ? pricing.weekendNightRate
        : pricing.weekdayNightRate;

      slots.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        display: `${hour === 0 ? 12 : hour}:00 AM`,
        available: true,
        price,
        category: "night",
        isWeekend,
        nextDay: true,
      });
    }

    setTimeSlots(slots);
  };

  const toggleSlot = (time: string) => {
    if (selectedSlots.includes(time)) {
      setSelectedSlots(selectedSlots.filter((t) => t !== time));
    } else {
      setSelectedSlots([...selectedSlots, time]);
    }
  };

  const calculateTotal = () => {
    return selectedSlots.reduce((total, slotTime) => {
      const slot = timeSlots.find((s) => s.time === slotTime);
      return total + (slot?.price || 0);
    }, 0);
  };

  const validateForm = (): boolean => {
    // Check if court is selected
    if (!selectedCourt) {
      toast({
        title: "Validation Error",
        description: "Please select a court",
        variant: "destructive",
      });
      return false;
    }

    // Check if slots are selected
    if (selectedSlots.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one time slot",
        variant: "destructive",
      });
      return false;
    }

    // If not blocked, customer info is required
    if (!isBlocked) {
      if (!customerName.trim()) {
        toast({
          title: "Validation Error",
          description: "Customer name is required",
          variant: "destructive",
        });
        return false;
      }

      if (!customerPhone.trim()) {
        toast({
          title: "Validation Error",
          description: "Customer phone is required",
          variant: "destructive",
        });
        return false;
      }

      // Validate Saudi phone format (mobile or landline)
      const phoneRegex = /^(05\d{8}|(\+966)(5|1[1-9])\d{7,8})$/;
      if (!phoneRegex.test(customerPhone.trim())) {
        toast({
          title: "Validation Error",
          description:
            "Please enter a valid Saudi phone number (05XXXXXXXX or +9661XXXXXXXX)",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Sort slots to get start and end time
      const sortedSlots = [...selectedSlots].sort();
      const startTime = sortedSlots[0];
      const endTime = sortedSlots[sortedSlots.length - 1];

      // Calculate end time (add 1 hour to last slot)
      const [endHour, endMinute] = endTime.split(":").map(Number);
      const actualEndTime = `${(endHour + 1).toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

      // Format date as YYYY-MM-DD
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      // Prepare booking data
      const bookingData = {
        courtId: selectedCourt,
        bookingDate: formattedDate,
        startTime,
        endTime: actualEndTime,
        notes: notes.trim() || undefined,
        isBlocked,
        customerName: !isBlocked ? customerName.trim() : undefined,
        customerPhone: !isBlocked ? customerPhone.trim() : undefined,
        customerEmail:
          !isBlocked && customerEmail.trim() ? customerEmail.trim() : undefined,
      };

      const response = await adminApi.bookings.createManual(bookingData);

      if (response.success) {
        toast({
          title: "Success",
          description: isBlocked
            ? "Time slot blocked successfully"
            : "Booking created successfully",
        });

        // Navigate back to bookings list
        navigate("/admin/bookings");
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    selectedCourt &&
    selectedSlots.length > 0 &&
    (isBlocked || (customerName.trim() && customerPhone.trim()));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/bookings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create Manual Booking
          </h1>
          <p className="text-muted-foreground">
            Create a new booking or block a time slot
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          {!isBlocked && (
            <div className="bg-card rounded-xl border p-6">
              <h2 className="font-semibold text-foreground mb-4">
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="05XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Date & Time Selection */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-foreground mb-4">Date & Time</h2>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setSelectedSlots([]); // Clear slots when date changes
                    }
                  }}
                  className="rounded-md border mt-2 pointer-events-auto"
                />
              </div>
              <div>
                <Label>Select Court</Label>
                {loadingCourts ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <Select
                    value={selectedCourt}
                    onValueChange={setSelectedCourt}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a court" />
                    </SelectTrigger>
                    <SelectContent>
                      {courts.map((court) => (
                        <SelectItem key={court.id} value={court.id}>
                          {court.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Block Time Slot</Label>
                    <Switch
                      checked={isBlocked}
                      onCheckedChange={setIsBlocked}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Block this time slot without creating a customer booking
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label className="mb-2 block">Select Time Slots</Label>
              {loadingPricing ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => toggleSlot(slot.time)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all border ${
                        selectedSlots.includes(slot.time)
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-muted/50 border-muted hover:bg-muted text-foreground"
                      }`}
                    >
                      <div>{slot.display}</div>
                      {!isBlocked && (
                        <div className="text-xs mt-1 opacity-70">
                          {slot.price} SAR
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-foreground mb-4">Admin Notes</h2>
            <Textarea
            <Textarea
              placeholder="Add any internal notes about this booking..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border p-6 sticky top-20">
            <h3 className="font-semibold text-foreground mb-4">
              Booking Summary
            </h3>

            <h3 className="font-semibold text-foreground mb-4">
              Booking Summary
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Court</span>
                <span className="font-medium text-foreground">
                  {courts.find((c) => c.id === selectedCourt)?.name ||
                    "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {format(selectedDate, "MMM d, yyyy")}
                </span>
                <span className="font-medium text-foreground">
                  {format(selectedDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">
                  {selectedSlots.length} hour(s)
                </span>
                <span className="font-medium text-foreground">
                  {selectedSlots.length} hour(s)
                </span>
              </div>
              {isBlocked && (
                <div className="flex items-center gap-2 text-warning text-sm">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  Blocking time slot
                </div>
              )}
            </div>

            {!isBlocked && (
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {calculateTotal()} SAR
                  </span>
                </div>
              </div>
            )}

            <Button
              variant="hero"
              className="w-full"
              size="lg"
              disabled={!isFormValid || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {isBlocked ? "Block Time Slot" : "Create Booking"}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Admin bookings bypass availability checks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewBooking;
