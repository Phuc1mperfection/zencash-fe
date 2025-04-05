import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  BarChart2,
  Users,
  Phone,
  LogIn,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/use-Auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Pricing", icon: <BarChart2 className="w-4 h-4" /> },
    { name: "About", icon: <Users className="w-4 h-4" /> },
    { name: "Contact", icon: <Phone className="w-4 h-4" /> },
  ];

  const handleSignIn = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed w-full transition-all duration-300 z-40 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            {/* <Wallet className="h-8 w-8 text-[#00ed64]" /> */}
            <img src="/logo.svg" alt="Zen Cash Logo" className="h-8 w-8" />
            <span
              className={`ml-2 text-xl font-bold transition-colors duration-300 dark:text-white text-primary ${
                isScrolled ? "text-[#001e2b]" : "text-primary"
              }`}
            >
              Zen Cash
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">
                  Welcome back,{" "}
                  <span className="font-semibold">{user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={`#${link.name.toLowerCase()}`}
                    className="flex items-center space-x-1 text-gray-600 hover:text-[#00ed64] transition-colors duration-200"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                ))}
                <button
                  onClick={handleSignIn}
                  className="flex items-center space-x-1 text-gray-600 hover:text-[#00ed64] transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                {/* <button className="bg-[#00ed64] text-[#001e2b] px-4 py-2 rounded-full font-medium hover:bg-[#00ed64]/90 transition-colors duration-200">
                  Get Started
                </button> */}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-[#00ed64] transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <div className="px-3 py-2">
                <span className="text-gray-600">
                  Welcome back,{" "}
                  <span className="font-semibold">{user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="mt-2 flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={`#${link.name.toLowerCase()}`}
                    className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-[#00ed64] transition-colors duration-200"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                ))}
                <button
                  onClick={handleSignIn}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-[#00ed64] transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
