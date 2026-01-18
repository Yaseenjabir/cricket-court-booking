import { useState } from "react";
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

const AdminBookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const bookings = [
    {
      id: "BK-2024-001847",
      customer: "Ahmed Al-Rashid",
      phone: "+966 50 123 4567",
      email: "ahmed@email.com",
      court: "Court 3",
      date: "Jan 18, 2024",
      time: "7:00 PM - 9:00 PM",
      duration: "2h",
      amount: "220 SAR",
      status: "confirmed",
      paymentStatus: "paid",
    },
    {
      id: "BK-2024-001846",
      customer: "Sara Mohammed",
      phone: "+966 50 234 5678",
      email: "sara@email.com",
      court: "Court 1",
      date: "Jan 18, 2024",
      time: "2:00 PM - 4:00 PM",
      duration: "2h",
      amount: "180 SAR",
      status: "completed",
      paymentStatus: "paid",
    },
    {
      id: "BK-2024-001845",
      customer: "Team Falcons",
      phone: "+966 50 345 6789",
      email: "falcons@email.com",
      court: "Court 4",
      date: "Jan 19, 2024",
      time: "8:00 PM - 12:00 AM",
      duration: "4h",
      amount: "550 SAR",
      status: "confirmed",
      paymentStatus: "partial",
    },
    {
      id: "BK-2024-001844",
      customer: "Khalid Ibrahim",
      phone: "+966 50 456 7890",
      email: "khalid@email.com",
      court: "Court 2",
      date: "Jan 18, 2024",
      time: "5:00 PM - 7:00 PM",
      duration: "2h",
      amount: "180 SAR",
      status: "confirmed",
      paymentStatus: "paid",
    },
    {
      id: "BK-2024-001843",
      customer: "Mohammed Ali",
      phone: "+966 50 567 8901",
      email: "mali@email.com",
      court: "Court 5",
      date: "Jan 19, 2024",
      time: "10:00 PM - 1:00 AM",
      duration: "3h",
      amount: "330 SAR",
      status: "pending",
      paymentStatus: "unpaid",
    },
    {
      id: "BK-2024-001842",
      customer: "Omar Hassan",
      phone: "+966 50 678 9012",
      email: "omar@email.com",
      court: "Court 1",
      date: "Jan 17, 2024",
      time: "6:00 PM - 8:00 PM",
      duration: "2h",
      amount: "220 SAR",
      status: "cancelled",
      paymentStatus: "refunded",
    },
    {
      id: "BK-2024-001841",
      customer: "Ali Youssef",
      phone: "+966 50 789 0123",
      email: "ali@email.com",
      court: "Court 3",
      date: "Jan 17, 2024",
      time: "3:00 PM - 5:00 PM",
      duration: "2h",
      amount: "180 SAR",
      status: "completed",
      paymentStatus: "paid",
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden w-full sm:max-w-none lg:w-auto">
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
      <div className="flex-1 border border-red-500 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
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
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
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
                    key={booking.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-medium text-foreground">
                        {booking.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm text-foreground truncate max-w-[150px]">
                        {booking.customer}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {booking.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {booking.court}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground whitespace-nowrap">
                        {booking.date}
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {booking.time}
                      </p>
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
                      {booking.amount}
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
                        <button
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        {booking.status !== "cancelled" &&
                          booking.status !== "completed" && (
                            <button
                              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                              title="Cancel"
                            >
                              <XCircle className="w-4 h-4 text-destructive" />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing 1-{filteredBookings.length} of {filteredBookings.length}{" "}
              bookings
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
                    {selectedBooking.id}
                  </p>
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
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium text-sm">
                    {selectedBooking.customer}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm">{selectedBooking.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm truncate">
                    {selectedBooking.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Court</p>
                  <p className="font-medium text-sm">{selectedBooking.court}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-sm">{selectedBooking.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-sm">{selectedBooking.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium text-sm">
                    {selectedBooking.duration}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-success text-sm">
                    {selectedBooking.amount}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="default" className="flex-1" size="sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                {selectedBooking.status !== "cancelled" &&
                  selectedBooking.status !== "completed" && (
                    <Button variant="destructive" className="flex-1" size="sm">
                      <XCircle className="w-4 h-4" />
                      Cancel
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
