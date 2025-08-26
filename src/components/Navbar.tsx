"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, User, Calendar, Users, DollarSign, MessageSquare, BookOpen } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Alumni', href: '/alumni', icon: Users },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Mentorship', href: '/mentorship', icon: BookOpen },
    { name: 'Donations', href: '/donations', icon: DollarSign },
    { name: 'Admin', href: '/admin', icon: User },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Alumni Platform</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <IconComponent size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent size={16} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <Button asChild className="w-full">
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
