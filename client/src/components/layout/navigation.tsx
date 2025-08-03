import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Home, GraduationCap, Code, Trophy, Menu, X } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/courses", label: "Courses", icon: GraduationCap },
    { path: "/ide", label: "IDE", icon: Code },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Code className="text-[var(--neon-green)] w-8 h-8" />
              <span className="font-orbitron text-xl font-bold">
                GenAI<span className="text-[var(--neon-blue)]">Code</span>
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && navItems.map((item) => (
              <Link key={item.path} href={item.path} className={`flex items-center space-x-2 transition-colors ${
                location === item.path 
                  ? 'text-[var(--neon-green)]' 
                  : 'text-gray-300 hover:text-[var(--neon-green)]'
              }`}>
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="hidden md:flex items-center space-x-3">
                  <img 
                    src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName + ' ' + user?.lastName)}&background=1a1a3a&color=ffffff`}
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover" 
                  />
                  <div className="text-sm">
                    <p className="text-white font-semibold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[var(--neon-green)] text-xs">{user?.xp || 0} XP</p>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button 
                  onClick={() => window.location.href = '/api/logout'}
                  className="hidden md:block px-4 py-2 text-sm border border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-[var(--space-900)] transition-all rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <button className="hidden md:block px-4 py-2 text-sm border border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-[var(--space-900)] transition-all rounded">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 text-sm bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] text-[var(--space-900)] font-semibold glow-button rounded">
                    Get Started
                  </button>
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-[var(--neon-green)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden mt-4 pt-4 border-t border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="space-y-4">
              {isAuthenticated && navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={`flex items-center space-x-2 py-2 transition-colors cursor-pointer ${
                      location === item.path 
                        ? 'text-[var(--neon-green)]' 
                        : 'text-gray-300 hover:text-[var(--neon-green)]'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
              
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <img 
                      src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName + ' ' + user?.lastName)}&background=1a1a3a&color=ffffff`}
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div>
                      <p className="text-white font-semibold">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[var(--neon-green)] text-sm">{user?.xp || 0} XP</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/api/logout'}
                    className="w-full px-4 py-2 text-sm border border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-[var(--space-900)] transition-all rounded"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-700 space-y-2">
                  <Link href="/signin">
                    <button 
                      className="w-full px-4 py-2 text-sm border border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-[var(--space-900)] transition-all rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button 
                      className="w-full px-4 py-2 text-sm bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] text-[var(--space-900)] font-semibold rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
