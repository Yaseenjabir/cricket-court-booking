import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, ArrowLeft, Check } from "lucide-react";
import { format } from "date-fns";

const AdminNewBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCourt, setSelectedCourt] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [forceBook, setForceBook] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const courts = ["Court 1", "Court 2", "Court 3", "Court 4", "Court 5"];
  
  const timeSlots = [];
  for (let hour = 9; hour < 24; hour++) {
    timeSlots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      display: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      available: Math.random() > 0.3,
    });
  }
  for (let hour = 0; hour < 4; hour++) {
    timeSlots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      display: `${hour === 0 ? 12 : hour}:00 AM`,
      available: Math.random() > 0.4,
    });
  }

  const existingCustomers = [
    { id: 1, name: "Ahmed Al-Rashid", phone: "+966 50 123 4567", email: "ahmed@email.com" },
    { id: 2, name: "Sara Mohammed", phone: "+966 50 234 5678", email: "sara@email.com" },
    { id: 3, name: "Khalid Ibrahim", phone: "+966 50 456 7890", email: "khalid@email.com" },
  ];

  const toggleSlot = (time: string) => {
    if (selectedSlots.includes(time)) {
      setSelectedSlots(selectedSlots.filter(t => t !== time));
    } else {
      setSelectedSlots([...selectedSlots, time]);
    }
  };

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
          <h1 className="text-2xl font-bold text-foreground">Create Manual Booking</h1>
          <p className="text-muted-foreground">Create a new booking with admin privileges</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-foreground mb-4">Customer Information</h2>
            
            {/* Search Existing Customer */}
            <div className="mb-4">
              <Label>Search Existing Customer</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or phone..." 
                  className="pl-10"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>
              {customerSearch && (
                <div className="mt-2 border rounded-lg divide-y">
                  {existingCustomers.filter(c => 
                    c.name.toLowerCase().includes(customerSearch.toLowerCase())
                  ).map(customer => (
                    <button 
                      key={customer.id}
                      className="w-full p-3 text-left hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium text-foreground">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-4">Or enter new customer details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="Customer name" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="+966 5X XXX XXXX" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="customer@email.com" />
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-foreground mb-4">Date & Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border mt-2 pointer-events-auto"
                />
              </div>
              <div>
                <Label>Select Court</Label>
                <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a court" />
                  </SelectTrigger>
                  <SelectContent>
                    {courts.map(court => (
                      <SelectItem key={court} value={court}>{court}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Force Book</Label>
                    <Switch checked={forceBook} onCheckedChange={setForceBook} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Override availability and force book this slot
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label className="mb-2 block">Select Time Slots</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => (slot.available || forceBook) && toggleSlot(slot.time)}
                    disabled={!slot.available && !forceBook}
                    className={`p-2 rounded-lg text-sm font-medium transition-all border ${
                      selectedSlots.includes(slot.time)
                        ? "bg-primary border-primary text-primary-foreground"
                        : slot.available || forceBook
                        ? "bg-muted/50 border-muted hover:bg-muted text-foreground"
                        : "bg-muted/30 border-muted text-muted-foreground cursor-not-allowed opacity-50"
                    }`}
                  >
                    {slot.display}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-foreground mb-4">Admin Notes</h2>
            <Textarea 
              placeholder="Add any internal notes about this booking..."
              rows={3}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border p-6 sticky top-20">
            <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Court</span>
                <span className="font-medium text-foreground">{selectedCourt || "Not selected"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">{format(selectedDate, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">{selectedSlots.length} hour(s)</span>
              </div>
              {forceBook && (
                <div className="flex items-center gap-2 text-warning text-sm">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  Force booking enabled
                </div>
              )}
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Estimated Total</span>
                <span className="text-2xl font-bold text-primary">{selectedSlots.length * 110} SAR</span>
              </div>
            </div>

            <Button variant="hero" className="w-full" size="lg" disabled={!selectedCourt || selectedSlots.length === 0}>
              <Check className="w-4 h-4" />
              Create Booking
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Admin bookings bypass customer verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewBooking;
