import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminCalendar = () => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const courts = ["Court 1", "Court 2", "Court 3", "Court 4", "Court 5"];
  
  // Generate time slots from 9 AM to 4 AM
  const timeSlots = [];
  for (let hour = 9; hour < 24; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  for (let hour = 0; hour <= 4; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Sample bookings data
  const bookings = [
    { id: "BK-001847", court: 0, startHour: 14, duration: 2, customer: "Ahmed Al-Rashid", status: "confirmed", amount: "180 SAR" },
    { id: "BK-001846", court: 1, startHour: 19, duration: 3, customer: "Sara Mohammed", status: "confirmed", amount: "330 SAR" },
    { id: "BK-001845", court: 2, startHour: 10, duration: 2, customer: "Team Falcons", status: "pending", amount: "180 SAR" },
    { id: "BK-001844", court: 3, startHour: 20, duration: 4, customer: "Khalid Ibrahim", status: "confirmed", amount: "440 SAR" },
    { id: "BK-001843", court: 4, startHour: 16, duration: 2, customer: "Mohammed Ali", status: "completed", amount: "180 SAR" },
    { id: "BK-001842", court: 0, startHour: 22, duration: 3, customer: "Omar Hassan", status: "confirmed", amount: "330 SAR" },
    { id: "BK-001841", court: 2, startHour: 17, duration: 2, customer: "Ali Youssef", status: "confirmed", amount: "220 SAR" },
  ];

  const getBookingForSlot = (courtIndex: number, hour: number) => {
    return bookings.find(b => 
      b.court === courtIndex && 
      hour >= b.startHour && 
      hour < b.startHour + b.duration
    );
  };

  const isBookingStart = (courtIndex: number, hour: number) => {
    return bookings.find(b => b.court === courtIndex && b.startHour === hour);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">View and manage all court bookings</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'day' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'week' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-card rounded-xl border mb-6">
        <div className="p-4 flex items-center justify-between">
          <button 
            onClick={() => setCurrentDate(addDays(currentDate, viewMode === 'day' ? -1 : -7))}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="font-semibold text-foreground text-lg">
              {viewMode === 'day' 
                ? format(currentDate, 'EEEE, MMMM d, yyyy')
                : `${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`
              }
            </h2>
          </div>
          <button 
            onClick={() => setCurrentDate(addDays(currentDate, viewMode === 'day' ? 1 : 7))}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-20 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase border-r">Time</th>
                  {courts.map((court, index) => (
                    <th key={index} className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase border-r last:border-r-0">
                      {court}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, timeIndex) => {
                  const hour = parseInt(time.split(':')[0]);
                  return (
                    <tr key={timeIndex} className="border-t">
                      <td className="px-4 py-2 text-sm text-muted-foreground border-r bg-muted/30">
                        {time}
                      </td>
                      {courts.map((_, courtIndex) => {
                        const booking = getBookingForSlot(courtIndex, hour);
                        const isStart = isBookingStart(courtIndex, hour);
                        
                        if (booking && !isStart) {
                          return null; // Cell is part of a booking but not the start
                        }
                        
                        return (
                          <td 
                            key={courtIndex} 
                            className="px-2 py-1 border-r last:border-r-0 h-12"
                            rowSpan={booking ? booking.duration : 1}
                          >
                            {booking ? (
                              <button
                                onClick={() => setSelectedBooking(booking)}
                                className={`w-full h-full rounded-lg p-2 text-left transition-all hover:shadow-md ${
                                  booking.status === 'confirmed' ? 'bg-success/20 border border-success/30' :
                                  booking.status === 'pending' ? 'bg-warning/20 border border-warning/30' :
                                  'bg-secondary/20 border border-secondary/30'
                                }`}
                              >
                                <p className="text-xs font-medium text-foreground truncate">{booking.customer}</p>
                                <p className="text-xs text-muted-foreground">{booking.duration}h • {booking.amount}</p>
                              </button>
                            ) : (
                              <div className="w-full h-full rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-24 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase border-r">Court</th>
                  {weekDays.map((day, index) => (
                    <th key={index} className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase border-r last:border-r-0">
                      <div>{format(day, 'EEE')}</div>
                      <div className="text-lg font-bold text-foreground">{format(day, 'd')}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courts.map((court, courtIndex) => (
                  <tr key={courtIndex} className="border-t">
                    <td className="px-4 py-4 text-sm font-medium text-foreground border-r bg-muted/30">
                      {court}
                    </td>
                    {weekDays.map((_, dayIndex) => {
                      const dayBookings = bookings.filter(b => b.court === courtIndex).slice(0, 2);
                      return (
                        <td key={dayIndex} className="px-2 py-2 border-r last:border-r-0 align-top">
                          <div className="space-y-1 min-h-[60px]">
                            {dayIndex < 3 && dayBookings.map((booking, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedBooking(booking)}
                                className={`w-full rounded p-1 text-left text-xs ${
                                  booking.status === 'confirmed' ? 'bg-success/20' :
                                  booking.status === 'pending' ? 'bg-warning/20' :
                                  'bg-secondary/20'
                                }`}
                              >
                                <p className="font-medium truncate">{booking.customer}</p>
                              </button>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/20 border border-success/30" />
          <span className="text-sm text-muted-foreground">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning/20 border border-warning/30" />
          <span className="text-sm text-muted-foreground">Pending Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary/20 border border-secondary/30" />
          <span className="text-sm text-muted-foreground">Completed</span>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono font-medium">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`status-badge ${
                    selectedBooking.status === 'confirmed' ? 'status-confirmed' :
                    selectedBooking.status === 'pending' ? 'status-pending' :
                    'status-completed'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedBooking.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Court</p>
                  <p className="font-medium">Court {selectedBooking.court + 1}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedBooking.duration} hours</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-success">{selectedBooking.amount}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="default" className="flex-1">
                  <Eye className="w-4 h-4" />
                  View Full Details
                </Button>
                <Button variant="outline" className="flex-1">
                  Edit Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCalendar;
