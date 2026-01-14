import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Lightbulb, Wifi, Car, ShowerHead, Coffee, ArrowRight } from "lucide-react";
import court1 from "@/assets/court-1.jpg";
import court2 from "@/assets/court-2.jpg";
import court3 from "@/assets/court-3.jpg";
import court4 from "@/assets/court-4.jpg";
import court5 from "@/assets/court-5.jpg";

const Courts = () => {
  const courts = [
    {
      id: 1,
      name: "Court 1 - Pro Lane",
      image: court1,
      description: "Our flagship professional lane with full-size pitch and premium facilities.",
      features: ["LED Flood Lights", "Professional Nets", "Air Conditioned", "Video Recording"],
      availability: "Available",
    },
    {
      id: 2,
      name: "Court 2 - Practice Arena",
      image: court2,
      description: "Perfect for practice sessions with bowling machine and video analysis.",
      features: ["LED Lights", "Bowling Machine", "Video Analysis", "Coaching Area"],
      availability: "Available",
    },
    {
      id: 3,
      name: "Court 3 - Match Court",
      image: court3,
      description: "Full-size match court ideal for team games and tournaments.",
      features: ["Full Size", "LED Lights", "Spectator Area", "Score Display"],
      availability: "Available",
    },
    {
      id: 4,
      name: "Court 4 - Training Zone",
      image: court4,
      description: "Dedicated training zone with multiple practice wickets.",
      features: ["Multiple Wickets", "LED Lights", "Equipment Storage", "Trainer Station"],
      availability: "Booked until 8 PM",
    },
    {
      id: 5,
      name: "Court 5 - Elite Court",
      image: court5,
      description: "Premium elite court for professional players and teams.",
      features: ["Premium Turf", "LED Lights", "VIP Lounge Access", "Private Changing Room"],
      availability: "Available",
    },
  ];

  const amenities = [
    { icon: Lightbulb, title: "LED Night Lighting", description: "Professional-grade LED lighting for evening play" },
    { icon: ShowerHead, title: "Changing Rooms", description: "Clean, spacious changing facilities with lockers" },
    { icon: Car, title: "Free Parking", description: "Ample parking space for all visitors" },
    { icon: Coffee, title: "Refreshments", description: "Café with snacks and beverages on-site" },
    { icon: Wifi, title: "Free WiFi", description: "High-speed internet throughout the facility" },
    { icon: Sun, title: "Climate Control", description: "Air-conditioned indoor courts for comfort" },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our Courts & Facilities
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            5 professional cricket courts equipped with the latest technology and maintained to international standards.
          </p>
        </div>
      </section>

      {/* Courts Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courts.map((court) => (
              <div key={court.id} className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={court.image} 
                    alt={court.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                    court.availability === "Available" 
                      ? "bg-success/90 text-success-foreground" 
                      : "bg-warning/90 text-warning-foreground"
                  }`}>
                    {court.availability}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{court.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{court.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {court.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link to="/booking">
                    <Button variant="default" className="w-full">
                      Book This Court
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Facility Amenities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for a comfortable and professional cricket experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <amenity.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{amenity.title}</h3>
                <p className="text-muted-foreground text-sm">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Pricing Overview</h2>
              <p className="text-muted-foreground">Transparent pricing with different rates based on time and day</p>
            </div>
            
            <div className="bg-card rounded-xl border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Day</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Time</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Category</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Price (SAR/hr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">Sun - Wed</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">9 AM - 7 PM</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded bg-secondary/20 text-secondary font-medium">Weekday Day</span></td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">90</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">Sun - Wed</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">7 PM - 4 AM</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded bg-primary/20 text-primary font-medium">Weekday Night</span></td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">110</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">Fri - Sat</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">9 AM - 7 PM</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded bg-accent/20 text-accent font-medium">Weekend Day</span></td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">110</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">Thu, Fri, Sat</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">7 PM - 4 AM</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded bg-warning/20 text-warning font-medium">Weekend Night</span></td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">135</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/booking">
                <Button variant="hero" size="lg">
                  Book Now & See Full Availability
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courts;
