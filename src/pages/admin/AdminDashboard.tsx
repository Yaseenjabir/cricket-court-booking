import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  Plus,
  ClipboardList,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { 
      title: "Today's Bookings", 
      value: "24", 
      change: "+12%", 
      trend: "up",
      icon: Calendar,
      color: "bg-primary/10 text-primary"
    },
    { 
      title: "Today's Revenue", 
      value: "4,520 SAR", 
      change: "+8%", 
      trend: "up",
      icon: DollarSign,
      color: "bg-success/10 text-success"
    },
    { 
      title: "Court Utilization", 
      value: "78%", 
      change: "+5%", 
      trend: "up",
      icon: TrendingUp,
      color: "bg-secondary/10 text-secondary"
    },
    { 
      title: "Active Customers", 
      value: "156", 
      change: "-3%", 
      trend: "down",
      icon: Users,
      color: "bg-warning/10 text-warning"
    },
  ];

  const todaysBookings = [
    { id: "BK-001847", customer: "Ahmed Al-Rashid", court: "Court 3", time: "7:00 PM - 9:00 PM", status: "confirmed", amount: "220 SAR" },
    { id: "BK-001846", customer: "Sara Mohammed", court: "Court 1", time: "2:00 PM - 4:00 PM", status: "completed", amount: "180 SAR" },
    { id: "BK-001845", customer: "Team Falcons", court: "Court 4", time: "8:00 PM - 12:00 AM", status: "pending", amount: "550 SAR" },
    { id: "BK-001844", customer: "Khalid Ibrahim", court: "Court 2", time: "5:00 PM - 7:00 PM", status: "confirmed", amount: "180 SAR" },
    { id: "BK-001843", customer: "Mohammed Ali", court: "Court 5", time: "10:00 PM - 1:00 AM", status: "confirmed", amount: "330 SAR" },
  ];

  const quickActions = [
    { title: "Add New Court", icon: Plus, href: "/admin/courts" },
    { title: "Create Booking", icon: ClipboardList, href: "/admin/bookings/new" },
    { title: "Generate Report", icon: FileText, href: "/admin/reports" },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/bookings/new">
            <Button variant="default">
              <Plus className="w-4 h-4" />
              New Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-success' : 'text-destructive'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Bookings */}
        <div className="lg:col-span-2 bg-card rounded-xl border">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Today's Bookings</h2>
            <Link to="/admin/bookings">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Booking ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Court</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Time</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {todaysBookings.map((booking, index) => (
                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-foreground">{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{booking.customer}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{booking.court}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{booking.time}</td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${
                        booking.status === 'confirmed' ? 'status-confirmed' :
                        booking.status === 'pending' ? 'status-pending' :
                        'status-completed'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground text-right">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Timeline */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <action.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{action.title}</span>
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Court Utilization */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-foreground mb-4">Court Utilization Today</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((court) => {
                const utilization = Math.floor(Math.random() * 40) + 50;
                return (
                  <div key={court}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Court {court}</span>
                      <span className="font-medium text-foreground">{utilization}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          utilization >= 80 ? 'bg-success' : utilization >= 50 ? 'bg-secondary' : 'bg-warning'
                        }`}
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
