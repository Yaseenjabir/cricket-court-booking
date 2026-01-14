import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format, addDays } from "date-fns";

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCourt, setSelectedCourt] = useState(1);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const courts = [
    { id: 1, name: "Court 1" },
    { id: 2, name: "Court 2" },
    { id: 3, name: "Court 3" },
    { id: 4, name: "Court 4" },
    { id: 5, name: "Court 5" },
  ];

  // Generate time slots from 9 AM to 4 AM (next day)
  const generateTimeSlots = () => {
    const slots = [];
    // 9 AM to 11 PM
    for (let hour = 9; hour < 24; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        display: `${hour > 12 ? hour - 12 : hour}:00 ${
          hour >= 12 ? "PM" : "AM"
        }`,
        available: Math.random() > 0.3,
        price: hour >= 19 ? 110 : 90,
        category: hour >= 19 ? "night" : "day",
      });
    }
    // 12 AM to 4 AM (next day)
    for (let hour = 0; hour < 4; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        display: `${hour === 0 ? 12 : hour}:00 AM`,
        available: Math.random() > 0.4,
        price: 110,
        category: "night",
        nextDay: true,
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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

  const priceCategories = [
    {
      label: "Weekday Day",
      color: "bg-secondary/20 border-secondary",
      price: "90 SAR/hr",
    },
    {
      label: "Weekday Night",
      color: "bg-primary/20 border-primary",
      price: "110 SAR/hr",
    },
    {
      label: "Weekend Day",
      color: "bg-accent/20 border-accent",
      price: "110 SAR/hr",
    },
    {
      label: "Weekend Night",
      color: "bg-warning/20 border-warning",
      price: "135 SAR/hr",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="hero-gradient py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            Book Your Court
          </h1>
          <p className="text-primary-foreground/80">
            Select your preferred date, time, and court
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Date Picker */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border p-4 sticky top-20">
              <h3 className="font-semibold text-foreground mb-4">
                Select Date
              </h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date < new Date()}
                className="rounded-md border pointer-events-auto"
              />

              {/* Court Selector */}
              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Select Court
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {courts.map((court) => (
                    <button
                      key={court.id}
                      onClick={() => setSelectedCourt(court.id)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedCourt === court.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {court.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Legend */}
              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Price Legend
                </h3>
                <div className="space-y-2">
                  {priceCategories.map((cat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border ${cat.color}`}
                        ></div>
                        <span className="text-sm text-muted-foreground">
                          {cat.label}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {cat.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Area - Time Grid */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border">
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Court {selectedCourt}
                    </p>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="p-4">
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
                        Court {selectedCourt}
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
