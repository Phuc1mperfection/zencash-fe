import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/use-Auth";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
  const fallbackInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "?";
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
      className={`fixed w-full transition-all duration-300 z-40  ${
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
              className={`ml-2 text-xl font-bold transition-colors duration-300  text-primary ${
                isScrolled ? "text-[#001e2b]" : "text-primary"
              }`}
            >
              Zen Cash
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 ">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">
                  {t("common.welcome")},{" "}
                  <span className="font-semibold">{user?.username}</span>
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-8 w-8 ml-1"
                    >
                     <Avatar className="w-9 h-9  border-primary/50">
                {/* Fallback gradient likely fine for both modes */}
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-2xl">
                  {fallbackInitial}
                </AvatarFallback>
              </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("dashboard/profile")}>{t("profile.title")}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("dashboard/settings")}>{t("settings.title")}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>{t("common.logout")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#00ed64] focus:outline-none"
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated && location.pathname !== "/dashboard" ? (
              <>
                <div className="px-3 py-2 text-gray-600">
                  {t("common.welcome")},{" "}
                  <span className="font-semibold">{user?.username}</span>
                </div>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full flex items-center px-3 py-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                >
                  <BarChart2 className="w-4 h-4 mr-2" />
                  <span>{t("common.dashboard")}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>{t("common.logout")}</span>
                </button>
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={`#${link.name.toLowerCase()}`}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-[#00ed64] transition-colors duration-200"
                  >
                    {link.icon}
                    <span className="ml-2">{link.name}</span>
                  </a>
                ))}
                <button
                  onClick={handleSignIn}
                  className="w-full flex items-center px-3 py-2 text-gray-600 hover:text-[#00ed64] transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  <span>{t("common.login")}</span>
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
