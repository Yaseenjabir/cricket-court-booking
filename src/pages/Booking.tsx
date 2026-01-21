import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { courtApi, pricingApi } from "@/lib/api";
import { Court, Pricing, TimeSlot } from "@/types/booking.types";
import { useToast } from "@/hooks/use-toast";

const Booking = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [slotError, setSlotError] = useState<string>("");

  // Loading states
  const [loadingCourts, setLoadingCourts] = useState(true);
  const [loadingPricing, setLoadingPricing] = useState(true);

  // API data states
  const [courts, setCourts] = useState<Court[]>([]);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  console.log("Debug:", {
    loadingCourts,
    loadingPricing,
    selectedCourt,
    courtsCount: courts.length,
    pricing,
    timeSlotsCount: timeSlots.length,
  });

  // Fetch courts on mount
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoadingCourts(true);
        const response = await courtApi.getAll();
        if (response.success && response.data) {
          const activeCourts = response.data.filter(
            (court: Court) => court.status === "active"
          );
          setCourts(activeCourts);
          if (activeCourts.length > 0) {
            setSelectedCourt(activeCourts[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch courts:", error);
      } finally {
        setLoadingCourts(false);
      }
    };

    fetchCourts();
  }, []);

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
      } finally {
        setLoadingPricing(false);
      }
    };

    fetchPricing();
  }, []);

  // Generate time slots when court, date, or pricing changes
  useEffect(() => {
    if (selectedCourt && pricing) {
      generateTimeSlots();
    }
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
        available: true, // Will be checked against bookings later
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
        available: true, // Will be checked against bookings later
        price,
        category: "night",
        isWeekend,
        nextDay: true,
      });
    }

    setTimeSlots(slots);
  };

  const toggleSlot = (time: string) => {
    setSlotError(""); // Clear any previous errors

    // If deselecting, always allow it
    if (selectedSlots.includes(time)) {
      setSelectedSlots(selectedSlots.filter((t) => t !== time));
      return;
    }

    // If this is the first slot, allow it
    if (selectedSlots.length === 0) {
      setSelectedSlots([time]);
      return;
    }

    // Check if the new slot is consecutive with existing selections
    const currentSlotIndex = timeSlots.findIndex((s) => s.time === time);
    const selectedIndices = selectedSlots
      .map((t) => timeSlots.findIndex((s) => s.time === t))
      .sort((a, b) => a - b);

    const minIndex = Math.min(...selectedIndices);
    const maxIndex = Math.max(...selectedIndices);

    // Allow adding only if it's adjacent to the current selection
    const isAdjacent =
      currentSlotIndex === minIndex - 1 || currentSlotIndex === maxIndex + 1;

    if (!isAdjacent) {
      setSlotError(
        "Please select consecutive time slots only. You can only add slots at the start or end of your current selection."
      );
      setTimeout(() => setSlotError(""), 4000); // Clear error after 4 seconds
      return;
    }

    // Check if adding this slot would create a gap
    const newIndices = [...selectedIndices, currentSlotIndex].sort(
      (a, b) => a - b
    );
    for (let i = 0; i < newIndices.length - 1; i++) {
      if (newIndices[i + 1] - newIndices[i] !== 1) {
        setSlotError(
          "Please select consecutive time slots only. Gaps are not allowed."
        );
        setTimeout(() => setSlotError(""), 4000);
        return;
      }
    }

    // If all checks pass, add the slot
    setSelectedSlots([...selectedSlots, time]);
  };

  const calculateTotal = () => {
    return selectedSlots.reduce((total, slotTime) => {
      const slot = timeSlots.find((s) => s.time === slotTime);
      return total + (slot?.price || 0);
    }, 0);
  };

  const goToPreviousDay = () => {
    const previousDay = subDays(selectedDate, 1);
    // Don't allow going to past dates
    if (previousDay >= new Date(new Date().setHours(0, 0, 0, 0))) {
      setSelectedDate(previousDay);
      setSelectedSlots([]); // Clear selected slots when changing date
      setSlotError(""); // Clear any errors
    }
  };

  const goToNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
    setSelectedSlots([]); // Clear selected slots when changing date
    setSlotError(""); // Clear any errors
  };

  const handleCourtChange = (courtId: string) => {
    // If user has selected slots and is changing court, warn them
    if (selectedSlots.length > 0 && courtId !== selectedCourt) {
      toast({
        title: "Court Changed",
        description: `Your previously selected time slots have been cleared. Please select slots for ${courts.find((c) => c.id === courtId)?.name || "the new court"}.`,
        variant: "default",
      });
      setSelectedSlots([]);
      setSlotError("");
    }
    setSelectedCourt(courtId);
  };

  const priceCategories = pricing
    ? [
        {
          label: "Weekday Day",
          color: "bg-secondary/20 border-secondary",
          price: `${pricing.weekdayDayRate} SAR/hr`,
        },
        {
          label: "Weekday Night",
          color: "bg-primary/20 border-primary",
          price: `${pricing.weekdayNightRate} SAR/hr`,
        },
        {
          label: "Weekend Day",
          color: "bg-accent/20 border-accent",
          price: `${pricing.weekendDayRate} SAR/hr`,
        },
        {
          label: "Weekend Night",
          color: "bg-warning/20 border-warning",
          price: `${pricing.weekendNightRate} SAR/hr`,
        },
      ]
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="hero-gradient py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-background mb-2">
            Book Your Court
          </h1>
          <p className="text-background/80">
            Select your preferred date, time, and court
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Date Picker */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border p-4 lg:sticky lg:top-20">
              <h3 className="font-semibold text-foreground mb-4">
                Select Date
              </h3>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setSelectedSlots([]); // Clear slots when date changes
                      setSlotError(""); // Clear any errors
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border pointer-events-auto"
                />
              </div>
              {/* Court Selector */}
              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Select Court
                </h3>
                {loadingCourts ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : courts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No courts available
                  </p>
                ) : (
                  <div className="space-y-2">
                    {courts.map((court) => (
                      <button
                        key={court.id}
                        onClick={() => handleCourtChange(court.id)}
                        className={`w-full p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                          selectedCourt === court.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {court.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Legend */}
              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Price Legend
                </h3>
                {loadingPricing ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {priceCategories.map((cat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-4 h-4 rounded border flex-shrink-0 ${cat.color}`}
                          ></div>
                          <span className=" text-xs sm:text-sm text-muted-foreground truncate">
                            {cat.label}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                          {cat.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Area - Time Grid */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border">
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={goToPreviousDay}
                    className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      selectedDate <= new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {courts.find((c) => c.id === selectedCourt)?.name ||
                        "Select a court"}
                    </p>
                  </div>
                  <button
                    onClick={goToNextDay}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="p-4">
                {loadingPricing || !selectedCourt || timeSlots.length === 0 ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.available && toggleSlot(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg text-sm font-medium transition-all border ${
                          selectedSlots.includes(slot.time)
                            ? "bg-primary border-primary text-primary-foreground shadow-md"
                            : slot.available
                              ? slot.category === "night"
                                ? "bg-primary/10 border-primary/30 hover:bg-primary/20 text-foreground"
                                : "bg-secondary/10 border-secondary/30 hover:bg-secondary/20 text-foreground"
                              : "bg-muted border-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        <div>{slot.display}</div>
                        {slot.available && (
                          <div className="text-xs mt-1 opacity-70">
                            {slot.price} SAR
                          </div>
                        )}
                        {!slot.available && (
                          <div className="text-xs mt-1">Booked</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Error message */}
                {slotError && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2">
                    <Info className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">{slotError}</p>
                  </div>
                )}

                {/* Overnight slots notice */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-start gap-2">
                  <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Slots from 12 AM to 4 AM are overnight slots and extend into
                    the next day. Price transitions occur at 7 PM.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border p-6 sticky top-20">
              <h3 className="font-semibold text-foreground mb-4">
                Booking Summary
              </h3>

              {selectedSlots.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Court</span>
                      <span className="font-medium text-foreground">
                        {courts.find((c) => c.id === selectedCourt)?.name ||
                          "Court"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium text-foreground">
                        {format(selectedDate, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">
                        {selectedSlots.length} hour(s)
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Selected Slots:
                    </h4>
                    <div className="space-y-1">
                      {selectedSlots.sort().map((slotTime) => {
                        const slot = timeSlots.find((s) => s.time === slotTime);
                        return (
                          <div
                            key={slotTime}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {slot?.display}
                            </span>
                            <span className="text-foreground">
                              {slot?.price} SAR
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-foreground">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {calculateTotal()} SAR
                      </span>
                    </div>
                    <Link
                      to="/booking/details"
                      state={{
                        court: selectedCourt,
                        date: selectedDate,
                        slots: selectedSlots,
                        total: calculateTotal(),
                      }}
                    >
                      <Button variant="hero" className="w-full" size="lg">
                        Continue to Details
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <CalendarIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Select time slots from the calendar to start your booking
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
