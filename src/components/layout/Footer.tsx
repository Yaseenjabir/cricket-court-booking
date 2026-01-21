import { Link } from "react-router-dom";
import {
  Volleyball,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Jeddah Cricket Nets Logo"
                  className="h-10 w-10 object-contain"
                />{" "}
              </div>
              <span className="font-bold text-xl">Jeddah Cricket Nets</span>
            </div>
            <p className="text-white text-sm">
              Premium cricket courts for players of all levels. Book your game
              today!
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted/20 flex items-center justify-center hover:bg-muted/30 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted/20 flex items-center justify-center hover:bg-muted/30 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted/20 flex items-center justify-center hover:bg-muted/30 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-background text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courts"
                  className="text-white hover:text-background text-sm transition-colors"
                >
                  Our Courts
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-white hover:text-background text-sm transition-colors"
                >
                  Book Now
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white hover:text-background text-sm transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Facilities */}
          <div>
            <h4 className="font-semibold mb-4">Facilities</h4>
            <ul className="space-y-2">
              <li className="text-white text-sm">5 Professional Courts</li>
              <li className="text-white text-sm">Night Lighting</li>
              <li className="text-white text-sm">Equipment Rental</li>
              <li className="text-white text-sm">Changing Rooms</li>
              <li className="text-white text-sm">Parking Available</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white">
                <MapPin className="w-4 h-4 text-secondary" />
                123 Sports Avenue, Riyadh, KSA
              </li>
              <li className="flex items-center gap-2 text-sm text-white">
                <Phone className="w-4 h-4 text-secondary" />
                +966 50 123 4567
              </li>
              <li className="flex items-center gap-2 text-sm text-white">
                <Mail className="w-4 h-4 text-secondary" />
                info@jeddahcricketnets.sa
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted/20 mt-8 pt-8 text-center text-sm text-white">
          <p>© 2024 Jeddah Cricket Nets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
