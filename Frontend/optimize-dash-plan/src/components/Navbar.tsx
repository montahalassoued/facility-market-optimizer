import { NavLink } from "./NavLink";
import { Factory, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-card-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 text-primary-foreground"
          >
            <Factory className="h-7 w-7" />
            <span className="text-xl font-semibold tracking-tight">
              OptiFlow
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-primary-foreground/80 font-medium rounded-md transition-all duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                activeClassName="bg-primary-foreground/15 text-primary-foreground"
                end={link.to === "/"}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 text-primary-foreground/80 font-medium rounded-md transition-all duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  activeClassName="bg-primary-foreground/15 text-primary-foreground"
                  end={link.to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
