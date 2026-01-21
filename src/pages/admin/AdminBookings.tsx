import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type AdminBooking = {
  _id: string;
  customer: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
  } | null;
  court: {
    _id: string;
    name: string;
    description?: string;
  };
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  paymentStatus: "paid" | "partial" | "unpaid" | "refunded";
  isBlocked?: boolean;
  notes?: string;
  createdAt: string;
  createdBy: "customer" | "admin";
};

const AdminBookings = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(
    null,
  );
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await adminApi.bookings.getAll();
        if (response.success && response.data) {
          // API returns { bookings, pagination }
          const data = response.data as unknown;
          const dataObj = data as
            | { bookings?: AdminBooking[] }
            | AdminBooking[];
          const bookingsData = Array.isArray(dataObj)
            ? dataObj
            : dataObj.bookings || [];
          setBookings(bookingsData);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancelling(bookingId);
      const response = await adminApi.bookings.cancel(bookingId);
      if (response.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "cancelled" as const } : b,
          ),
        );
        toast({
          title: "Success",
          description: "Booking cancelled successfully",
        });
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setCancelling(null);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHours] = startTime.split(":").map(Number);
    const [endHours] = endTime.split(":").map(Number);
    let duration = endHours - startHours;
    if (duration < 0) duration += 24; // Handle overnight
    return `${duration}h`;
  };

  const filteredBookings = bookings.filter((booking) => {
    const customerName = booking.customer?.name || "Blocked Slot";
    const matchesSearch =
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-background border-b p-4 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Bookings Management
            </h1>
            <p className="text-muted-foreground text-sm">
              View and manage all court bookings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">Export</span>
            </Button>
            <Link to="/admin/bookings/new">
              <Button variant="default" size="sm" className="text-xs">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-1">New Booking</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scrollable Content - NO horizontal scroll here */}
      <div className="flex-1 p-4 lg:p-6 w-full">
        {/* Filters */}
        <div className="bg-card rounded-xl border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name or booking ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings Table - Scroll ONLY inside here */}
        <div className="bg-card w-full overflow-x-scroll rounded-xl">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[140px]">
                      Booking ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[180px]">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[100px]">
                      Court
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[160px]">
                      Date & Time
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[100px]">
                      Created By
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[120px]">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[110px]">
                      Payment
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[100px]">
                      Amount
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap w-[120px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-medium text-foreground">
                          {booking._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {booking.isBlocked ? (
                          <p className="font-medium text-sm text-warning truncate max-w-[150px]">
                            🔒 Blocked Slot
                          </p>
                        ) : (
                          <>
                            <p className="font-medium text-sm text-foreground truncate max-w-[150px]">
                              {booking.customer?.name || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {booking.customer?.phone || "N/A"}
                            </p>
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {booking.court.name}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground whitespace-nowrap">
                          {formatDate(booking.bookingDate)}
                        </p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(booking.startTime)} -{" "}
                          {formatTime(booking.endTime)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                            booking.createdBy === "admin"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                          }`}
                        >
                          {booking.createdBy === "admin"
                            ? "👤 Admin"
                            : "🌐 Customer"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`status-badge ${
                            booking.status === "confirmed"
                              ? "status-confirmed"
                              : booking.status === "pending"
                                ? "status-pending"
                                : booking.status === "completed"
                                  ? "status-completed"
                                  : "status-cancelled"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                            booking.paymentStatus === "paid"
                              ? "bg-success/10 text-success"
                              : booking.paymentStatus === "partial"
                                ? "bg-warning/10 text-warning"
                                : booking.paymentStatus === "refunded"
                                  ? "bg-secondary/10 text-secondary"
                                  : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground text-right whitespace-nowrap">
                        {booking.totalAmount} SAR
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          {booking.status !== "cancelled" &&
                            booking.status !== "completed" && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                disabled={cancelling === booking._id}
                                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
                                title="Cancel"
                              >
                                {cancelling === booking._id ? (
                                  <Loader2 className="w-4 h-4 text-destructive animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-destructive" />
                                )}
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Showing 1-{filteredBookings.length} of{" "}
                  {filteredBookings.length} bookings
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary text-primary-foreground min-w-[32px]"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="min-w-[32px]">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="min-w-[32px]">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono font-medium text-sm">
                    {selectedBooking._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded inline-block ${
                      selectedBooking.createdBy === "admin"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {selectedBooking.createdBy === "admin"
                      ? "👤 Admin"
                      : "🌐 Customer"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded inline-block ${
                      selectedBooking.createdBy === "admin"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {selectedBooking.createdBy === "admin"
                      ? "👤 Admin"
                      : "🌐 Customer"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`status-badge ${
                      selectedBooking.status === "confirmed"
                        ? "status-confirmed"
                        : selectedBooking.status === "pending"
                          ? "status-pending"
                          : selectedBooking.status === "completed"
                            ? "status-completed"
                            : "status-cancelled"
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
                {selectedBooking.isBlocked ? (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium text-sm text-warning">
                      🔒 Blocked Time Slot
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium text-sm">
                        {selectedBooking.customer?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-sm">
                        {selectedBooking.customer?.phone || "N/A"}
                      </p>
                    </div>
                    {selectedBooking.customer?.email && (
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-sm truncate">
                          {selectedBooking.customer.email}
                        </p>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Court</p>
                  <p className="font-medium text-sm">
                    {selectedBooking.court.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-sm">
                    {formatDate(selectedBooking.bookingDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-sm">
                    {formatTime(selectedBooking.startTime)} -{" "}
                    {formatTime(selectedBooking.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium text-sm">
                    {calculateDuration(
                      selectedBooking.startTime,
                      selectedBooking.endTime,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-success text-sm">
                    {selectedBooking.totalAmount} SAR
                  </p>
                </div>
                {selectedBooking.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium text-sm">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                {selectedBooking.status !== "cancelled" &&
                  selectedBooking.status !== "completed" && (
                    <Button
                      variant="destructive"
                      className="flex-1"
                      size="sm"
                      onClick={() => handleCancelBooking(selectedBooking._id)}
                      disabled={cancelling === selectedBooking._id}
                    >
                      {cancelling === selectedBooking._id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </>
                      )}
                    </Button>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
