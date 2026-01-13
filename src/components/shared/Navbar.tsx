"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Book,
  Home,
  Library,
  Search,
  Video,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { useState } from "react";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const userLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/browse", label: "Browse Books", icon: Search },
    { href: "/my-library", label: "My Library", icon: Library },
    { href: "/tutorials", label: "Tutorials", icon: Video },
  ];

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/books", label: "Manage Books", icon: Book },
    { href: "/admin/genres", label: "Manage Genres", icon: Book },
    { href: "/admin/users", label: "Manage Users", icon: User },
    { href: "/admin/reviews", label: "Moderate Reviews", icon: Book },
    { href: "/admin/tutorials", label: "Manage Tutorials", icon: Video },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
          >
            <Book className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary font-serif">
              BookWorm
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                    isActive(link.href)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-primary">
                <AvatarImage src={user?.photo} alt={user?.name} />
                <AvatarFallback className="bg-primary text-white font-semibold">
                  {getInitials(user?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="destructive"
              size="sm"
              className="flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {/* User Info */}
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
              <Avatar className="w-12 h-12 border-2 border-primary">
                <AvatarImage src={user?.photo} alt={user?.name} />
                <AvatarFallback className="bg-primary text-white font-semibold text-lg">
                  {getInitials(user?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Links */}
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-all ${
                    isActive(link.href)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-primary/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            {/* Logout */}
            <Button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              variant="destructive"
              className="w-full flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
